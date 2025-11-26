import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// ✔ FIXED CORS (allows your frontend + localhost + mobile)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://career-builder-frontend.vercel.app", // your deployed frontend
      "https://*.vercel.app" // optional wildcard for preview deployments
    ],
    credentials: true,
  })
);

app.use(express.json());

// ROUTES BEFORE 404
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
