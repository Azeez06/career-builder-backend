// src/controllers/portfolioController.js
import Portfolio from "../models/Portfolio.js";

// 📌 Save or update portfolio data
export const savePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find existing portfolio or create a new one
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({ user: userId });
    }

    // Update fields from request body
    portfolio.profile = req.body.profile || portfolio.profile;
    portfolio.services = req.body.services || portfolio.services;
    portfolio.projects = req.body.projects || portfolio.projects;
    portfolio.contact = req.body.contact || portfolio.contact;
    portfolio.updatedAt = Date.now();

    await portfolio.save();

    return res.json({
      message: "Portfolio saved successfully",
      portfolio,
    });

  } catch (err) {
    console.error("savePortfolio error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 📌 Set public username for portfolio
export const setPortfolioUsername = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    // Check if username already exists for another user
    const exists = await Portfolio.findOne({
      publicUsername: username,
      user: { $ne: userId }
    });

    if (exists) return res.status(400).json({ message: "Username already taken" });

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { publicUsername: username, isPublic: true },
      { new: true, upsert: true }
    );

    return res.json({
      message: "Portfolio username set",
      username: portfolio.publicUsername
    });

  } catch (err) {
    console.error("setPortfolioUsername error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 📌 View public portfolio by username
export const getPublicPortfolio = async (req, res) => {
  try {
    const username = req.params.username;

    const portfolio = await Portfolio.findOne({
      publicUsername: username,
      isPublic: true
    }).populate("user", "fullName email");

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.json({
      profile: portfolio.profile,
      services: portfolio.services,
      projects: portfolio.projects,
      contact: portfolio.contact,
      user: {
        fullName: portfolio.user.fullName,
        email: portfolio.user.email,
      }
    });

  } catch (err) {
    console.error("getPublicPortfolio error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
