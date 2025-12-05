const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  place_id: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },

  passType: { type: String, default: "Standard" },
  amount: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);
