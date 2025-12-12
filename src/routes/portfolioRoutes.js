import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  savePortfolio,
  setPortfolioUsername,
  getPublicPortfolio,
  getMyPortfolio   // <-- ADD THIS
} from "../controllers/portfolioController.js";

const router = express.Router();

console.log("📁 portfolioRoutes.js LOADED");
console.log("📌 Registering portfolio routes");

// Protected routes
router.put("/save", protect, savePortfolio);
router.put("/set-username", protect, setPortfolioUsername);
router.get("/me", protect, getMyPortfolio);  // <-- Now it works!

// Public portfolio route
router.get("/view/:username", getPublicPortfolio);

export default router;
