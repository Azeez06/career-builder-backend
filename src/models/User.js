// src/models/User.js
import mongoose from "mongoose";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, unique: true, lowercase: true, trim: true }, // remove 'required'
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // optional fields
    phone: { type: String },
    linkedin: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// Pre-validate hook to auto-generate username from fullName
userSchema.pre("validate", function(next) {
  if (this.fullName && !this.username) {
    // generate slug
    this.username = slugify(this.fullName, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("User", userSchema);
