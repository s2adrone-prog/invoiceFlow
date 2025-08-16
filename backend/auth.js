// auth.js (Express Router)
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mysql from "mysql2/promise";

const router = express.Router();
const SECRET = "your_secret"; // Use env variable in production

// DB connection
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "yourdb"
});

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  password: "yourpassword",
  database: "yourdb"
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (rows.length === 0) return res.status(400).json({ message: "User not found" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "15m" });
  await db.query("UPDATE users SET reset_token=?, reset_token_expiry=DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE email=?", [token, email]);

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "youremail@gmail.com", pass: "yourpassword" }
  });

  const link = `http://localhost:3000/reset-password?token=${token}`;
  await transporter.sendMail({
    from: "youremail@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click here to reset password: ${link}`
  });

  res.json({ message: "Password reset link sent to email" });
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE email=?", [hashedPassword, decoded.email]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;