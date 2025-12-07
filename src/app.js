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


app.use(cors({
  origin: [
    "https://my-real-final-plp-project-8q5a.vercel.app",
    "https://my-real-final-plp-pro-git-2df1a0-azeezsulaiman05-9367s-projects.vercel.app",
    "https://my-real-final-plp-project-8q5a-h020aldie.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// ROUTES BEFORE 404
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
