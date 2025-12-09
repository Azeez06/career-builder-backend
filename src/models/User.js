// src/models/User.js
import mongoose from "mongoose";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, unique: true, lowercase: true, trim: true }, // NOT required
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String },
    linkedin: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// Pre-save hook to generate username
userSchema.pre("validate", function () {
  if (this.fullName && !this.username) {
    this.username = slugify(this.fullName, { lower: true, strict: true });
  }
});


export default mongoose.model("User", userSchema);
