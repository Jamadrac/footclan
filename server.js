import express from "express";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
import cors from "cors";
import os from "os";
import qrcode from "qrcode";

const app = express();

// Other middleware
app.use(express.json());
app.use(morgan("tiny"));

// Allow all CORS requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const port = 8000;

// Basic GET route
app.get("/", (req, res) => {
  res.status(200).json("Hello World! dc");
});

// API routes
app.use("/api", router);
connect()
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
      process.exit(1);
    });

// Start the server
app.listen(port, "0.0.0.0", () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = "localhost";

  for (const interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName];
    for (const address of interfaceInfo) {
      if (address.family === "IPv4" && !address.internal) {
        ipAddress = address.address;
        break;
      }
    }
  }

  const url = `http://${ipAddress}:${port}`;
  console.log(`Server is running at ${url}`);

  // Generate QR code
  qrcode.toString(url, { type: "terminal", width: 10 }, (err, qrCode) => {
    if (err) {
      console.error("Failed to generate QR code:", err);
    } else {
      console.log("Scan the following QR code to access the server:");
      console.log(qrCode);
    }
  });
});
