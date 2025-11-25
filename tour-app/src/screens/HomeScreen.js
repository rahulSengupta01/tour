import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { getWeather } from "../api/weatherService";
import { searchPlace } from "../api/placesService"; // uses OSM

// Utility: Calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // return km
}

export default function HomeScreen() {
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setCoords(loc.coords);

      // Reverse Geocode → Convert lat/lon to place name
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geo && geo.length > 0) {
        const place = geo[0];
        setLocationName(
          `${place.name || ""}, ${place.city || place.district || ""}`
        );
      }

      // Fetch weather
      const weatherData = await getWeather(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setWeather(weatherData);

      // Fetch nearby tourist places using OSM
      const query = `tourist attractions around ${loc.coords.latitude}, ${loc.coords.longitude}`;
      const placesData = await searchPlace(query);

      // Add distance to each place
      const enhancedPlaces = placesData.map((p) => {
        if (p.lat && p.lon) {
          const distance = getDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            parseFloat(p.lat),
            parseFloat(p.lon)
          );
          return { ...p, distance };
        }
        return p;
      });

      setPlaces(enhancedPlaces);
      setLoading(false);
    } catch (error) {
      console.log("Location / Weather Error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Tour App 🌍</Text>

      {/* Location Name */}
      <View style={styles.box}>
        <Text style={styles.heading}>📍 Your Location</Text>
        <Text style={styles.locationText}>{locationName}</Text>
      </View>

      {/* Weather */}
      {weather && (
        <View style={styles.box}>
          <Text style={styles.heading}>🌤 Current Weather</Text>
          <Text>Temperature: {(weather.main.temp - 273.15).toFixed(1)}°C</Text>
          <Text>Condition: {weather.weather[0].description}</Text>
          <Text>Humidity: {weather.main.humidity}%</Text>
        </View>
      )}

      {/* Tourist Places */}
      <View style={styles.box}>
        <Text style={styles.heading}>🏞 Nearby Tourist Places</Text>
        {places.length === 0 ? (
          <Text>No places found.</Text>
        ) : (
          places.map((p, i) => (
            <Text key={i} style={styles.placeItem}>
              • {p.display_name}
              {"\n"}
              <Text style={styles.distanceText}>📏 {p.distance} km away</Text>
              {"\n\n"}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  box: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  placeItem: { marginVertical: 5, fontSize: 16, lineHeight: 22 },
  distanceText: { color: "gray", fontSize: 14 },
  locationText: { fontSize: 18, fontWeight: "600" },
});
