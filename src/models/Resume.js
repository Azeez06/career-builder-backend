import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", ResumeSchema);
