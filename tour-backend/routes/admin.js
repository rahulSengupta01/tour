// tour-backend/routes/admin.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Place = require("../models/Place");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminAuth = require("../utils/adminAuth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile } = require("../utils/firebase");

// ---------- ADMIN LOGIN ----------
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const admin = await Admin.findOne({ mobile });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, place_id: admin.place_id, role: admin.role });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------- SUPERADMIN CREATE ADMIN (but route under admin file) ----------
router.post("/create", adminAuth, async (req, res) => {
  try {
    if (req.role !== "superadmin")
      return res.status(403).json({ msg: "Only superadmin can create admins" });

    const { name, mobile, password, place_id } = req.body;
    const check = await Admin.findOne({ mobile });
    if (check) return res.status(400).json({ msg: "Mobile already used" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      mobile,
      password: hashed,
      place_id,
      role: "admin",
    });

    return res.json({ msg: "Admin created", admin });
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------- GET ADMIN'S PLACE ----------
router.get("/place", adminAuth, async (req, res) => {
  try {
    const place = await Place.findById(req.place_id);
    return res.json(place);
  } catch (err) {
    console.error("GET ADMIN PLACE ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------- UPDATE ADMIN'S PLACE ----------
router.put("/place", adminAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.place_id, req.body, {
      new: true,
    });
    return res.json(place);
  } catch (err) {
    console.error("UPDATE PLACE ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------- UPLOAD PLACE IMAGE (Firebase) ----------
router.post(
  "/place/image",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: "No file provided" });
      const fileName = `places/${req.place_id}/${Date.now()}-${req.file.originalname}`;
      const url = await uploadFile(req.file.path, fileName);

      await Place.findByIdAndUpdate(req.place_id, {
        $push: { images: url },
      });

      return res.json({ imageUrl: url });
    } catch (err) {
      console.error("UPLOAD IMAGE ERROR:", err);
      return res.status(500).json({ msg: "Upload failed", error: err.message });
    }
  }
);

module.exports = router;
