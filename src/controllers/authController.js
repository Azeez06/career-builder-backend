import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/**
 * POST /api/auth/register
 * body: { fullName, email, password }
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user (username generated automatically via User model pre-save)
   const user = new User({ fullName, email, password: hashed });
await user.save();


    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username // <-- added username
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/login
 * body: { email, password }
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username // <-- added username
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/auth/me
 * Protected route - returns current user (without password)
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(req.user._id).select("-password");
    return res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username, // <-- added username
        phone: user.phone,
        linkedin: user.linkedin,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
