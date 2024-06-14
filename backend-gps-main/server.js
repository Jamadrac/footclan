import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

/** Middlewares */
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);
app.options("*", cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // Less hackers know about our stack

const port = 8000;

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

/** API routes */
app.use("/api", router);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`);

  connect().catch((error) => {
    console.error("Error connecting to the database:", error);
  });
});

// Error handling for the server
server.on("error", (error) => {
  console.error("Error starting the server:", error);
});
