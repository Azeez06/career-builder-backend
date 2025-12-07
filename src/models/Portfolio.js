// src/models/Portfolio.js
import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  profile: {
    name: String,
    title: String,
    bio: String,
    image: String,
  },

  services: [
    { title: String, description: String },
  ],

  projects: [
    { title: String, description: String, link: String },
  ],

  contact: {
    email: String,
    phone: String,
    linkedin: String,
  },

  publicUsername: { type: String, unique: true, sparse: true },
  isPublic: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Portfolio", PortfolioSchema);
