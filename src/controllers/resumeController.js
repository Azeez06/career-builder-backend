// 📄 DEBUG: Check if controller file loads
console.log("📄 resumeController.js LOADED");

import Resume from "../models/Resume.js";

/**
 * POST /api/resume/create
 */
export const createResume = async (req, res) => {
  console.log("📥 HIT: POST /api/resume/create");

  try {
    console.log("🧪 Incoming Headers:", req.headers);
    console.log("🧪 Incoming Body:", req.body);
    console.log("🧪 Authenticated User:", req.user);

    const userId = req.user?._id;
    if (!userId) {
      console.log("❌ No user found in req.user - protect middleware failed");
      return res.status(401).json({ message: "Not authorized" });
    }

    const data = req.body;
    data.user = userId;

    const resume = await Resume.create(data);

    console.log("✅ Resume created successfully:", resume._id);

    return res.status(201).json({
      message: "Resume created",
      resume
    });

  } catch (err) {
    console.error("❌ createResume error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /api/resume/my
 */
export const getMyResumes = async (req, res) => {
  console.log("📥 HIT: GET /api/resume/my");

  try {
    const resumes = await Resume.find({ user: req.user._id })
                                .sort({ createdAt: -1 });

    console.log(`📦 Found ${resumes.length} resumes`);

    return res.json({ resumes });

  } catch (err) {
    console.error("❌ getMyResumes error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/resume/update/:id
 */
export const updateResume = async (req, res) => {
  console.log("📥 HIT: PUT /api/resume/update/" + req.params.id);

  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      console.log("❌ Resume not found");
      return res.status(404).json({ message: "Resume not found" });
    }

    if (String(resume.user) !== String(req.user._id)) {
      console.log("❌ Forbidden update attempt");
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(resume, req.body, { updatedAt: Date.now() });
    await resume.save();

    console.log("✅ Resume updated:", resume._id);

    return res.json({
      message: "Resume updated",
      resume
    });

  } catch (err) {
    console.error("❌ updateResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getSingleResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });

  } catch (err) {
    console.error("getSingleResume error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * DELETE /api/resume/delete/:id
 */
export const deleteResume = async (req, res) => {
  console.log("📥 HIT: DELETE /api/resume/delete/" + req.params.id);

  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      console.log("❌ Resume not found");
      return res.status(404).json({ message: "Resume not found" });
    }

    if (String(resume.user) !== String(req.user._id)) {
      console.log("❌ Forbidden delete attempt");
      return res.status(403).json({ message: "Forbidden" });
    }

    await resume.remove();

    console.log("🗑️ Resume deleted:", resume._id);

    return res.json({ message: "Resume deleted" });

  } catch (err) {
    console.error("❌ deleteResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/portfolio/save
 * Save or update portfolio data
 */
export const savePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    let resume = await Resume.findOne({ user: userId });
    if (!resume) {
      resume = await Resume.create({ user: userId });
    }

    resume.portfolio = req.body;  
    resume.updatedAt = Date.now();

    await resume.save();

    return res.json({
      message: "Portfolio saved successfully",
      portfolio: resume.portfolio,
    });

  } catch (err) {
    console.error("savePortfolio error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * PUT /api/portfolio/set-username
 */
export const setPortfolioUsername = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    // Check if username already exists for another user
    const exists = await Resume.findOne({
      publicUsername: username,
      user: { $ne: userId }
    });

    if (exists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      { publicUsername: username, isPublic: true },
      { new: true }
    );

    return res.json({
      message: "Portfolio username set",
      username: resume.publicUsername
    });

  } catch (err) {
    console.error("setPortfolioUsername error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/portfolio/view/:email
 * Public portfolio page
 */
export const getPublicPortfolio = async (req, res) => {
  try {
    const email = req.params.email;

    // Find the user first by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the resume linked to this user
    const resume = await Resume.findOne({
      user: user._id,
      isPublic: true,
    });

    if (!resume) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.json({
      profile: resume.portfolio?.profile,
      services: resume.portfolio?.services,
      projects: resume.portfolio?.projects,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("getPublicPortfolio error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
