const express = require("express");
const router = express.Router(); // ✅ THIS WAS MISSING
const axios = require("axios");
const Place = require("../models/Place");

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon)
      return res.status(400).json({ msg: "lat & lon required" });

    // ✅ FETCH FROM GEOAPIFY
    const geoURL = `https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=circle:${lon},${lat},5000&limit=30&apiKey=${GEOAPIFY_KEY}`;
    const geo = await axios.get(geoURL);

    const results = [];

    for (const item of geo.data.features) {
      const ext = {
        name: item.properties.name || "Unknown",
        address: item.properties.address_line2 || "No address",
        lat: item.properties.lat,
        lon: item.properties.lon,
        distance: item.properties.distance,
        image: item.properties.image || null,
      };

      // ✅ SAFE MATCH USING RANGE (~100m)
      const match = await Place.findOne({
        "location.lat": { $gte: ext.lat - 0.001, $lte: ext.lat + 0.001 },
        "location.lon": { $gte: ext.lon - 0.001, $lte: ext.lon + 0.001 },
      });

      results.push({
        external: ext,
        managed: match || null,
      });
    }

    res.json({ results });
  } catch (err) {
    console.log("Nearby Places Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
