import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();
const cors = require("cors");
// Middleware

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json()); // JSON parsing middleware
app.use(morgan("tiny")); // HTTP request logging

app.disable("x-powered-by"); // Hide server stack information

const port = 8000;

// Basic GET route
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the API"); // Changed status to 200 and message
});

// API routes
app.use("/api", router);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  connect()
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
      process.exit(1); // Exit the process if unable to connect to the database
    });
});

// Error handling for the server startup
server.on("error", (error) => {
  console.error("Error starting the server:", error);
});
