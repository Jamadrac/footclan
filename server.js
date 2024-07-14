import express from "express";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
import allowCors from "./allowCors.js";

const app = express();

// Wrap the entire application with the CORS middleware
app.use((req, res, next) => allowCors((req, res) => next())(req, res));

// Other middleware
// app.use(express.json());
// app.use(morgan("tiny"));

const port = 8000;

// Basic GET route
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
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
      process.exit(1);
    });
});

// Error handling for the server startup
server.on("error", (error) => {
  console.error("Error starting the server:", error);
});
