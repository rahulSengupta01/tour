// tour-app/src/api/placesService.js
import axios from "axios";

const API_URL="http://10.99.83.42:5000"; // 🔴 CHANGE THIS

export const getNearbyTouristPlaces = async (lat, lon) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/places/nearby?lat=${lat}&lon=${lon}`
    );

    return res.data.results;
  } catch (err) {
    console.log("Nearby Places Error:", err.message);
    return [];
  }
};

export const getPlaceById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/places/${id}`);
    return res.data;
  } catch (err) {
    console.log("Get place error", err.message);
    return null;
  }
};
