import axios from "axios";

export const searchPlace = async (query) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=10`;

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "TourApp/1.0 (your-email@example.com)",
        Accept: "application/json",
      },
    });

    return res.data;
  } catch (err) {
    console.log("OSM Error:", err.response?.data || err.message);
    return [];
  }
};
