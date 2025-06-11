import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique Username"],
    unique: [true, "Username Exist"],
    index: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },  email: {
    type: String,
    required: [true, "Please provide a unique email"],
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: String },
  address: { type: String },
  profile: { type: String },
  
  otp: {
    code: String,
    expiresAt: Date,
  },
});

export default mongoose.model("User", UserSchema);
