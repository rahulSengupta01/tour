// tour-app/src/screens/HomeScreen.js
// tour-app/src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { getWeather } from "../api/weatherService";
import { getNearbyTouristPlaces } from "../api/placesService";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

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
        alert("Location access denied.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setCoords(loc.coords);

      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geo && geo.length > 0) {
        const place = geo[0];
        setLocationName(`${place.city || place.district}, ${place.region}`);
      }

      const weatherData = await getWeather(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setWeather(weatherData);

      // ✅ FETCH FROM YOUR BACKEND (NOT GEOAPIFY DIRECTLY)
      const placesData = await getNearbyTouristPlaces(
        loc.coords.latitude,
        loc.coords.longitude
      );

      setPlaces(placesData);
      setLoading(false);
    } catch (e) {
      console.log("HomeScreen Error:", e);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Tour App 🌍</Text>

      {/* Location + Weather Row */}
      <View style={styles.row}>
        <View style={styles.infoBox}>
          <Text style={styles.heading}>📍 Location</Text>
          <Text style={styles.locationText}>{locationName}</Text>
        </View>

        {weather && (
          <View style={styles.infoBox}>
            <Text style={styles.heading}>🌤 Weather</Text>
            <Text style={styles.weatherText}>
              {(weather.main.temp - 273.15).toFixed(1)}°C
            </Text>
            <Text style={{ fontSize: 13 }}>
              {weather.weather[0].description}
            </Text>
          </View>
        )}
      </View>

      {/* Tourist Places Cards */}
      <Text style={styles.sectionTitle}>Nearby Tourist Places 🏞</Text>

      {places.length === 0 ? (
        <Text>No tourist places found.</Text>
      ) : (
        places.map((item, i) => {
          const isManaged = item.managed !== null;
          const place = isManaged ? item.managed : item.external;

          return (
            <View key={i} style={styles.card}>
              {/* Image */}
              <Image
                source={{
                  uri:
                    place?.image ||
                    place?.images?.[0] ||
                    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png",
                }}
                style={styles.cardImage}
              />

              {/* Text Info */}
              <Text style={styles.cardTitle}>{place.name}</Text>
              <Text style={styles.cardAddress}>
                {item.external?.address || "Address not available"}
              </Text>

              <Text style={styles.distance}>
                📏 {(item.external.distance / 1000).toFixed(1)} km away
              </Text>

              {/* ✅ SHOW BOOK PASS ONLY FOR DB PLACES */}
              {isManaged ? (
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() =>
                    navigation.navigate("PlaceDetails", {
                      placeId: item.managed._id,
                      external: item.external,
                    })
                  }
                >
                  <Text style={styles.bookBtnText}>Book Pass</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.externalBadge}>
                  <Text style={styles.externalText}>Pass not available</Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBox: {
    width: "48%",
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
  },

  heading: { fontSize: 18, fontWeight: "bold" },
  locationText: { fontSize: 16, marginTop: 4, fontWeight: "600" },
  weatherText: { fontSize: 22, fontWeight: "bold", marginTop: 4 },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardAddress: { fontSize: 14, color: "gray" },
  distance: { fontSize: 14, marginTop: 4 },

  bookBtn: {
    backgroundColor: "#007bff",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  bookBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  externalBadge: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  externalText: {
    color: "#555",
    fontWeight: "bold",
  },
});
