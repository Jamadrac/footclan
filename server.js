import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

// Middleware
// const corsOptions = {
//   origin: "*", // Allow all origins
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allow all methods
//   allowedHeaders:
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token", // Allow all headers
//   credentials: true, // Allow cookies and credentials
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.disable("x-powered-by");

const port = 8000;

// Basic GET route
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the CORS-enabled 999999 server");
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
