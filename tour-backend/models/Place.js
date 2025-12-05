// tour-backend/models/Place.js
const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },

  images: [{ type: String }], // Firebase URLs

  passInfo: {
    available: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    validity: { type: String, default: "" },
    details: { type: String, default: "" },
  },

  authorized: { type: Boolean, default: false },

  // Used for matching with external API places
  location: {
    lat: { type: Number, default: 0 },
    lon: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Place", PlaceSchema);
