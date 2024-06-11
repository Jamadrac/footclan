import mongoose from "mongoose";
import ENV from "../config.js";

async function connect() {
  mongoose.set("strictQuery", true);
  try {
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log("Database Connected");
    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export default connect;
