import UserModel from "../model/User_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import nodemailer from "nodemailer";
import config from "../config.js";
import { Router } from "express"; // Import Router from express

const app = Router(); // Initialize the Router correctly

/** GET: http://localhost:8000/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    const user = await UserModel.findOne({ username });

    if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

    // Remove password from user
    const { password, ...rest } = user.toJSON();

    return res.status(200).send(rest);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** PUT: http://localhost:8000/api/updateuser */
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).send({ error: "User Not Found...!" });
    }

    const body = req.body;

    // If password is being updated, hash it first
    if (body.password) {
      const saltRounds = 10;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    // Update the data
    await UserModel.updateOne({ _id: userId }, body);

    return res.status(201).send({ msg: "Record Updated...!" });
  } catch (error) {
    console.error("Error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).send({ error: "Email already exists" });
    }

    return res.status(500).send({ error: "Internal Server Error" });
  }
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});

/** POST: http://localhost:8000/api/register */
export async function register(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Request body cannot be empty" });
    }

    const { username, password, profile, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).send({
        error: "Username, password, and email are required",
      });
    }

    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).send({ error: "Username already exists" });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Email already exists" });
    }    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .send({ msg: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ error: error.message });
  }
}

/** POST: http://localhost:8000/api/login */
export async function login(req, res) {
  const { username, password } = req.body;
  console.log("Login attempt:", { username, password: "****" });

  try {
    // Try to find user by username first, then by email
    let user = await UserModel.findOne({ username });
    
    // If not found by username, try finding by email
    if (!user) {
      user = await UserModel.findOne({ email: username });
    }

    if (!user) {
      console.log("User not found with username or email:", username);
      return res.status(404).send({ error: "Username or Email not Found" });
    }

    console.log("User found:", { id: user._id, username: user.username, email: user.email });// Check password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("Password mismatch:", { provided: password, stored: user.password });
      return res.status(400).send({ error: "Password does not Match" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "72h" }
    );

    return res.status(200).send({
      msg: "Login Successful...!",
      username: user.username || "not updated",
      id: user._id || "not updated",
      firstName: user.firstName || "not updated",
      email: user.email || "not updated",
      lastName: user.lastName || "not updated",
      mobile: user.mobile || "not updated",
      address: user.address || "not updated",
      profile: user.profile || "not updated",
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

/** POST: http://localhost:8000/api/request-reset-password */
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    user.otp = {
      code: otp,
      expiresAt: otpExpiry,
    };
    await user.save();

    const mailOptions = {
      from: config.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: ` html: 
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Your OTP for password reset is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      ,`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send({
      message: "OTP sent successfully to your email",
      email: email,
    });
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    return res.status(500).send({
      error: "Failed to process password reset request",
      details: error.message,
    });
  }
}

/** POST: http://localhost:8000/api/reset-password */
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    // Trim whitespace from OTP
    const trimmedOtp = otp ? otp.trim() : null;

    if (!email || !trimmedOtp || !newPassword) {
      return res.status(400).send({
        error: "Email, OTP, and new password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (!user.otp?.code || !user.otp?.expiresAt) {
      return res.status(400).send({ error: "No OTP request found" });
    }

    if (new Date() > new Date(user.otp.expiresAt)) {
      user.otp = undefined;
      await user.save();
      return res.status(400).send({ error: "OTP has expired" });
    }

    if (user.otp.code !== trimmedOtp) { // Use trimmedOtp for comparison
      return res.status(400).send({ error: "Invalid OTP" });
    }    // Hash the new password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    const mailOptions = {
      from: config.EMAIL,
      to: email,
      subject: "Password Reset Successful",
      html: `...`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).send({
      error: "Failed to reset password",
      details: error.message,
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({}, "-password"); // Exclude password field
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
}

// Delete user by ID
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
}

export default app; // Export app to use the routes in your main server file
