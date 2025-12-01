// tour-app/src/api/placesService.js
import axios from "axios";
import { GEOAPIFY_KEY } from "@env";

export const getNearbyTouristPlaces = async (lat, lon) => {
  try {
    const url = `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights&filter=circle:${lon},${lat},5000&limit=20&apiKey=${GEOAPIFY_KEY}`;

    const response = await axios.get(url);

    return response.data.features.map((item) => ({
      name: item.properties.name || "Unknown Place",
      address: item.properties.address_line2 || "No address available",
      lat: item.properties.lat,
      lon: item.properties.lon,
      distance: item.properties.distance,
    }));
  } catch (err) {
    console.log("Geoapify Error:", err.response?.data || err.message);
    return [];
  }
};
