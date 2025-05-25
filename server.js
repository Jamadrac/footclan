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

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    const clientInfo = connectedClients.get(socket.id);
    if (clientInfo) {
      if (clientInfo.type === 'device') {
        // Remove device from connected devices
        connectedDevices.delete(clientInfo.serialNumber);
        
        // Notify all clients about device disconnection
        socket.broadcast.emit('device-disconnected', { 
          serialNumber: clientInfo.serialNumber 
        });
      }
      
      connectedClients.delete(socket.id);
    }
  });

  // Handle ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// Database connection
connect()
  .then(() => {
    console.log("Connected to database");
    server.listen(port, '0.0.0.0', () => {
      const localIP = getLocalIP();
      console.log(`Server is running on:`);
      console.log(`  Local:    http://localhost:${port}`);
      console.log(`  Network:  http://${localIP}:${port}`);
      console.log(`  WebSocket: ws://${localIP}:${port}`);
     
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });

export default app;
