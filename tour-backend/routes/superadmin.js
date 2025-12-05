// tour-backend/routes/superadmin.js
const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
const Place = require("../models/Place");
const adminAuth = require("../utils/adminAuth");
const bcrypt = require("bcryptjs");

// ----------------------------
// CREATE PLACE (with debug logging)
// ----------------------------
router.post("/place/create", adminAuth, async (req, res) => {
  console.log("🔥 SUPERADMIN CREATE PLACE API HIT");

  console.log("Request Body:", req.body);
  console.log("Admin Role:", req.role);

  try {
    if (req.role !== "superadmin") {
      console.log("❌ BLOCKED: Not superadmin");
      return res.status(403).json({ msg: "Only superadmin allowed" });
    }

    const payload = req.body || {};

    // Validate name
    if (!payload.name || payload.name.trim() === "") {
      console.log("❌ Name missing");
      return res.status(400).json({ msg: "Place name is required" });
    }

    // Normalize lat/lon
    if (payload.location) {
      payload.location.lat = Number(payload.location.lat);
      payload.location.lon = Number(payload.location.lon);

      if (isNaN(payload.location.lat) || isNaN(payload.location.lon)) {
        console.log("❌ Invalid latitude/longitude");
        return res.status(400).json({ msg: "Invalid latitude or longitude" });
      }
    }

    const place = await Place.create(payload);

    console.log("✅ Place created successfully:", place._id);

    res.json({ msg: "Place created", place });

  } catch (err) {
    console.log("❌ CREATE PLACE ERROR:", err);
    res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
});

// ----------------------------
// LIST PLACES
// ----------------------------
router.get("/places", adminAuth, async (req, res) => {
  try {
    if (req.role !== "superadmin")
      return res.status(403).json({ msg: "Only superadmin allowed" });

    const places = await Place.find({});
    res.json(places);
  } catch (err) {
    console.log("LIST ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----------------------------
// CREATE ADMIN
// ----------------------------
router.post("/admin/create", adminAuth, async (req, res) => {
  try {
    if (req.role !== "superadmin")
      return res.status(403).json({ msg: "Only superadmin allowed" });

    const { name, mobile, password, place_id } = req.body;

    const exists = await Admin.findOne({ mobile });
    if (exists) return res.status(400).json({ msg: "Mobile already used" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      mobile,
      password: hashed,
      role: "admin",
      place_id,
    });

    res.json({ msg: "Admin created", admin });
  } catch (err) {
    console.log("ADMIN CREATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----------------------------
// LIST ADMINS
// ----------------------------
router.get("/admins", adminAuth, async (req, res) => {
  try {
    if (req.role !== "superadmin")
      return res.status(403).json({ msg: "Only superadmin allowed" });

    const admins = await Admin.find({}).populate("place_id", "name");
    res.json(admins);
  } catch (err) {
    console.log("ADMINS LIST ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
