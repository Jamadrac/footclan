import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json()); // JSON parsing middleware

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Your other configurations and routes...

const port = process.env.PORT || 8000;

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Error handling for the server startup
server.on("error", (error) => {
  console.error("Error starting the server:", error);
});
