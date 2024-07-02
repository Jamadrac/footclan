import express from "express";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("tiny"));

app.disable("x-powered-by");

const port = 8000;

// Basic GET route
app.get("/", (req, res) => {
  res.status(200).json("the lord has brought it to no cors with xx 2");
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
