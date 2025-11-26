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

app.use(cors());
app.use(express.json());

// ROUTES MUST BE BEFORE 404
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 + error handlers MUST BE LAST
app.use(notFound);
app.use(errorHandler);

export default app;
