import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  savePortfolio,
  setPortfolioUsername,
  getPublicPortfolio
} from "../controllers/portfolioController.js";

const router = express.Router();

console.log("📁 portfolioRoutes.js LOADED");
console.log("📌 Registering portfolio routes");

// Protected routes
router.put("/save", protect, savePortfolio);
router.put("/set-username", protect, setPortfolioUsername);

// Public portfolio route
router.get("/view/:username", getPublicPortfolio);

export default router;
