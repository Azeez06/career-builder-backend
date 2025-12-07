import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  getMyResumes,
  updateResume,
  deleteResume,
  getSingleResume
} from "../controllers/resumeController.js";

const router = express.Router();

console.log("📁 resumeRoutes.js LOADED");
console.log("📌 Registering resume routes");

// RESUME ROUTES
router.post("/create", protect, createResume);
router.get("/my", protect, getMyResumes);
router.put("/update/:id", protect, updateResume);
router.delete("/delete/:id", protect, deleteResume);
router.get("/:id", protect, getSingleResume);

export default router;
