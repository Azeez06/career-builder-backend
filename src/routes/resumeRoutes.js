// 📁 DEBUG: Check if this file is loading
console.log("📁 resumeRoutes.js LOADED");

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createResume,
  getMyResumes,
  updateResume,
  deleteResume,
  getSingleResume,
  savePortfolio,
  setPortfolioUsername,
  getPublicPortfolio
} from "../controllers/resumeController.js";

const router = express.Router();

// 📌 DEBUG: Route registration
console.log("📌 Registering resume + portfolio routes");

// RESUME ROUTES
router.post("/create", protect, createResume);
router.get("/my", protect, getMyResumes);
router.put("/update/:id", protect, updateResume);
router.delete("/delete/:id", protect, deleteResume);
router.get("/:id", protect, getSingleResume);

// PORTFOLIO ROUTES
router.put("/portfolio/save", protect, savePortfolio);
router.put("/portfolio/set-username", protect, setPortfolioUsername);
// Public portfolio by email
router.get("/portfolio/view/:email", getPublicPortfolio);


export default router;
