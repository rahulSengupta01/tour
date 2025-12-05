const express = require("express");
const router = express.Router();
const adminAuth = require("../utils/adminAuth");
const Booking = require("../models/Booking");
const Place = require("../models/Place");

// ---------- REVENUE ----------
router.get("/dashboard/revenue", adminAuth, async (req, res) => {
  try {
    const placeId = req.place_id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const week = new Date();
    week.setDate(week.getDate() - 7);

    const month = new Date();
    month.setDate(month.getDate() - 30);

    const todayRevenue = await Booking.aggregate([
      { $match: { place_id: placeId, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const weekRevenue = await Booking.aggregate([
      { $match: { place_id: placeId, createdAt: { $gte: week } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const monthRevenue = await Booking.aggregate([
      { $match: { place_id: placeId, createdAt: { $gte: month } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      today: todayRevenue[0]?.total || 0,
      week: weekRevenue[0]?.total || 0,
      month: monthRevenue[0]?.total || 0,
    });
  } catch (err) {
    console.log("REVENUE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------- BOOKINGS ----------
router.get("/dashboard/bookings", adminAuth, async (req, res) => {
  try {
    const placeId = req.place_id;

    const bookings = await Booking.find({ place_id: placeId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(bookings);
  } catch (err) {
    console.log("BOOKINGS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
