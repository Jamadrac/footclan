import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

const port = 8000;

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request zc");
});

/** api routes */
app.use("/api", router);

// Start the server

const server = app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`);

  connect().catch((error) => {
    console.error("Error connecting to the database:", error);
  });
});

// i dont care anymore
server.on("error", (error) => {
  console.error("Error starting the server:", error);
});
