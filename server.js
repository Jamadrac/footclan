// Import statements
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { networkInterfaces } from "os";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
});
const port = 8000;

// Function to get local IP address
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// Middleware
app.use(morgan('dev')); // Add request logging
app.use(express.json());
app.use(cors());

// Custom Morgan token for request body
morgan.token('req-body', (req) => {
  const body = {...req.body};
  if (body.password) body.password = '****'; // Hide sensitive data
  return JSON.stringify(body);
});

// Use custom format for detailed logging including request body
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'));

// API routes
app.use("/api", router);

// Store connected clients and device info
const connectedDevices = new Map(); // Map of serialNumber -> socket.id
const connectedClients = new Map(); // Map of socket.id -> device info

// WebSocket connection handling

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle device registration (from Flutter app)
  socket.on('register-device', (data) => {
    const { serialNumber, deviceInfo } = data;
    console.log(`Device registered: ${serialNumber}`, deviceInfo);
    
    connectedDevices.set(serialNumber, socket.id);
    connectedClients.set(socket.id, { 
      type: 'device', 
      serialNumber, 
      deviceInfo,
      connectedAt: new Date()
    });
    
    socket.join(`device:${serialNumber}`);
    
    // Notify all web clients about the new device
    socket.broadcast.emit('device-connected', { serialNumber, deviceInfo });
  });

  // Handle web client registration (from React app)
  socket.on('register-client', (data) => {
    const { clientId, watchingDevices } = data;
    console.log(`Web client registered: ${clientId}`, watchingDevices);
    
    connectedClients.set(socket.id, { 
      type: 'client', 
      clientId, 
      watchingDevices: watchingDevices || [],
      connectedAt: new Date()
    });

    // Join rooms for devices they want to watch
    if (watchingDevices && watchingDevices.length > 0) {
      watchingDevices.forEach(serialNumber => {
        socket.join(`device:${serialNumber}`);
      });
    }

    // Send current connected devices to the new client
    const activeDevices = Array.from(connectedClients.values())
      .filter(client => client.type === 'device')
      .map(device => ({
        serialNumber: device.serialNumber,
        deviceInfo: device.deviceInfo,
        connectedAt: device.connectedAt
      }));
    
    socket.emit('active-devices', activeDevices);
  });

  // Handle location updates from devices
  socket.on('location-update', (data) => {
    const { serialNumber, latitude, longitude, timestamp, accuracy, speed, altitude } = data;
    console.log(`Location update from ${serialNumber}:`, { latitude, longitude, timestamp });
    
    const locationData = {
      serialNumber,
      latitude,
      longitude,
      timestamp,
      accuracy,
      speed,
      altitude,
      receivedAt: new Date().toISOString()
    };

    // Broadcast to all clients watching this device
    io.to(`device:${serialNumber}`).emit('live-location-update', locationData);
    
    // Also broadcast to all connected web clients
    socket.broadcast.emit('device-location-update', locationData);
  });

  // Handle subscription to specific device updates
  socket.on('watch-device', (data) => {
    const { serialNumber } = data;
    console.log(`Client ${socket.id} started watching device: ${serialNumber}`);
    
    socket.join(`device:${serialNumber}`);
    
    // Update client info
    const clientInfo = connectedClients.get(socket.id);
    if (clientInfo && clientInfo.type === 'client') {
      if (!clientInfo.watchingDevices.includes(serialNumber)) {
        clientInfo.watchingDevices.push(serialNumber);
      }
    }
  });

  // Handle unsubscription from device updates
  socket.on('unwatch-device', (data) => {
    const { serialNumber } = data;
    console.log(`Client ${socket.id} stopped watching device: ${serialNumber}`);
    
    socket.leave(`device:${serialNumber}`);
    
    // Update client info
    const clientInfo = connectedClients.get(socket.id);
    if (clientInfo && clientInfo.type === 'client') {
      clientInfo.watchingDevices = clientInfo.watchingDevices.filter(sn => sn !== serialNumber);
    }
  });

  // P2P Signaling Relay Logic
  // 1. Handle signals from Flutter device, relay to web client(s)
  // Flutter emits: 'device-signal' with { signal: offerSdpOrCandidate, deviceId: flutterDeviceSerialNumber }
  socket.on('device-signal', (data) => {
    const flutterDeviceSerialNumber = data.deviceId;
    const signalPayload = data.signal;
    const clientInfo = connectedClients.get(socket.id);

    if (!flutterDeviceSerialNumber || !signalPayload) {
      console.error(`[P2P] Invalid device-signal received from ${clientInfo?.serialNumber || socket.id}:`, data);
      return;
    }

    // Ensure the sender is the device it claims to be, if it's a registered device
    if (clientInfo && clientInfo.type === 'device' && clientInfo.serialNumber !== flutterDeviceSerialNumber) {
        console.error(`[P2P] device-signal from ${clientInfo.serialNumber} (socket ${socket.id}) has mismatched deviceId ${flutterDeviceSerialNumber}. Ignoring.`);
        return;
    }

    console.log(`[P2P] Relaying 'device-signal' from Flutter device ${flutterDeviceSerialNumber} (socket ${socket.id}) to web client(s) watching it.`);
    // Emit to all clients in the room for this device.
    // Web clients should join 'device:<serialNumber>' room if they want to interact with that device.
    // Event for web client: 'incoming-p2p-signal-from-device'
    socket.to(`device:${flutterDeviceSerialNumber}`).emit('incoming-p2p-signal-from-device', {
      signal: signalPayload,
      fromDeviceId: flutterDeviceSerialNumber
    });
  });

  // 2. Handle signals from web client, relay to specific Flutter device
  // Web client emits: 'web-client-p2p-signal' with { targetDeviceId: flutterDeviceSerialNumber, signal: answerSdpOrCandidate }
  socket.on('web-client-p2p-signal', (data) => {
    const targetDeviceSerialNumber = data.targetDeviceId;
    const signalPayload = data.signal;
    const clientInfo = connectedClients.get(socket.id); // Info about the sender (web client)

    if (!targetDeviceSerialNumber || !signalPayload) {
      console.error(`[P2P] Invalid web-client-p2p-signal received from ${clientInfo?.clientId || socket.id}:`, data);
      // Optionally notify sender: socket.emit('p2p-error', 'Invalid signal data');
      return;
    }

    // Basic validation: ensure sender is a known client (optional, but good)
    if (!clientInfo || clientInfo.type !== 'client') {
        console.warn(`[P2P] web-client-p2p-signal from unknown or non-client socket ${socket.id}. Relaying anyway if target device exists.`);
        // Depending on security requirements, you might want to return here if sender must be a registered client.
    }

    const deviceSocketId = connectedDevices.get(targetDeviceSerialNumber);
    if (deviceSocketId) {
      console.log(`[P2P] Relaying 'web-client-p2p-signal' from web client ${clientInfo?.clientId || socket.id} (socket ${socket.id}) to device ${targetDeviceSerialNumber} (socket ${deviceSocketId})`);
      // Event for Flutter device: 'incoming-p2p-signal-from-web'
      io.to(deviceSocketId).emit('incoming-p2p-signal-from-web', {
        signal: signalPayload,
        fromClientId: clientInfo?.clientId || socket.id // Let the device know who sent it (optional)
      });
    } else {
      console.error(`[P2P] Web client ${clientInfo?.clientId || socket.id} (socket ${socket.id}) tried to send signal to offline/unknown device: ${targetDeviceSerialNumber}`);
      // Notify the web client back that the target device is not available
      socket.emit('p2p-target-not-found', { targetDeviceId: targetDeviceSerialNumber, message: 'Target device not connected or not found.' });
    }
  });

  // 3. Handle 'web-ready' from web client, relay to specific Flutter device
  // Web client emits: 'p2p-connection-ready-from-web' with { targetDeviceId: flutterDeviceSerialNumber }
  socket.on('p2p-connection-ready-from-web', (data) => {
    const targetDeviceSerialNumber = data.targetDeviceId;
    const clientInfo = connectedClients.get(socket.id); // Info about the sender (web client)

    if (!targetDeviceSerialNumber) {
      console.error(`[P2P] Invalid p2p-connection-ready-from-web received from ${clientInfo?.clientId || socket.id}: Missing targetDeviceId.`, data);
      socket.emit('p2p-error', { message: 'Missing targetDeviceId in p2p-connection-ready-from-web signal.' });
      return;
    }

    // Basic validation: ensure sender is a known client (optional)
    if (!clientInfo || clientInfo.type !== 'client') {
        console.warn(`[P2P] p2p-connection-ready-from-web from unknown or non-client socket ${socket.id}. Relaying anyway if target device exists.`);
    }

    const deviceSocketId = connectedDevices.get(targetDeviceSerialNumber);
    if (deviceSocketId) {
      console.log(`[P2P] Relaying 'p2p-connection-ready-from-web' from web client ${clientInfo?.clientId || socket.id} (socket ${socket.id}) to device ${targetDeviceSerialNumber} (socket ${deviceSocketId})`);
      // Event for Flutter device: 'p2p-web-client-ready'
      io.to(deviceSocketId).emit('p2p-web-client-ready', {
        fromClientId: clientInfo?.clientId || socket.id, // Let the device know which web client is ready
        // You might include other relevant info from the web client if needed
      });
    } else {
      console.error(`[P2P] Web client ${clientInfo?.clientId || socket.id} (socket ${socket.id}) sent p2p-connection-ready-from-web for offline/unknown device: ${targetDeviceSerialNumber}`);
      // Notify the web client back that the target device is not available
      socket.emit('p2p-target-not-found', { targetDeviceId: targetDeviceSerialNumber, message: 'Target device for p2p-connection-ready not connected or not found.' });
    }
  });

  // 4. Handle 'peer-disconnect' from web client, relay to specific Flutter device
  // Web client emits: 'p2p-disconnect-from-web' with { targetDeviceId: flutterDeviceSerialNumber, reason: 'optional_reason' }
  socket.on('p2p-disconnect-from-web', (data) => {
    const targetDeviceSerialNumber = data.targetDeviceId;
    const clientInfo = connectedClients.get(socket.id); // Info about the sender (web client)

    if (!targetDeviceSerialNumber) {
      console.error(`[P2P] Invalid p2p-disconnect-from-web received from ${clientInfo?.clientId || socket.id}: Missing targetDeviceId.`, data);
      socket.emit('p2p-error', { message: 'Missing targetDeviceId in p2p-disconnect-from-web signal.' });
      return;
    }

    const deviceSocketId = connectedDevices.get(targetDeviceSerialNumber);
    if (deviceSocketId) {
      console.log(`[P2P] Relaying 'p2p-disconnect-from-web' from web client ${clientInfo?.clientId || socket.id} (socket ${socket.id}) to device ${targetDeviceSerialNumber} (socket ${deviceSocketId})`);
      // Event for Flutter device: 'p2p-web-client-disconnected'
      io.to(deviceSocketId).emit('p2p-web-client-disconnected', {
        fromClientId: clientInfo?.clientId || socket.id,
        reason: data.reason || 'No reason provided'
      });
    } else {
      console.error(`[P2P] Web client ${clientInfo?.clientId || socket.id} (socket ${socket.id}) sent p2p-disconnect-from-web for offline/unknown device: ${targetDeviceSerialNumber}`);
      // Optionally notify the web client that the target device is not available
      socket.emit('p2p-target-not-found', { targetDeviceId: targetDeviceSerialNumber, message: 'Target device for p2p-disconnect not connected or not found.' });
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Remove from connected clients map
    connectedClients.delete(socket.id);
    
    // Also remove from connected devices map if it was a device
    for (const [serialNumber, sId] of connectedDevices.entries()) {
      if (sId === socket.id) {
        console.log(`Removing disconnected device from registry: ${serialNumber}`);
        connectedDevices.delete(serialNumber);
        break;
      }
    }

    // Notify other clients about the disconnection
    socket.broadcast.emit('client-disconnected', { socketId: socket.id });
  });
});

// Database connection
connect();

// Start server
server.listen(port, () => {
  console.log(`Server running at http://${getLocalIP()}:${port}/`);
});

export default app;
