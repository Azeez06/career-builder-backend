import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Existing resume fields
  title: { type: String, default: "My Resume" },
  personal: {
    fullName: String,
    email: String,
    phone: String,
    city: String,
    country: String,
    linkedin: String,
  },
  summary: String,

  experiences: [
    {
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],

  education: [
    {
      degree: String,
      school: String,
      year: String,
    },
  ],

  skills: [String],
  certifications: [String],
  technicalSkills: String,

  // NEW: Portfolio system
  portfolio: {
    profile: {
      name: String,
      title: String,
      bio: String,
      image: String,
    },
    services: [
      {
        title: String,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
  },

  publicUsername: { type: String, unique: true, sparse: true },
  isPublic: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", ResumeSchema);
