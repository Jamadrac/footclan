import mongoose from "mongoose";
import ENV from "../config.js";

async function connect() {
  try {
    // Attempt to connect to the MongoDB database
    const db = await mongoose.connect(ENV.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected");
    return db;
  } catch (err) {
    // Log the error if the connection fails
    console.error("Database connection error:", err);
  }
}

export default connect;
