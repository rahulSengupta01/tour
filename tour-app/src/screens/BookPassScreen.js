// tour-app/src/screens/BookPassScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { getPlaceById } from "../api/placesService";

export default function BookPassScreen({ route, navigation }) {
  const { placeId } = route.params;

  const [place, setPlace] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    loadPlace();
  }, []);

  const loadPlace = async () => {
    const data = await getPlaceById(placeId);
    setPlace(data);
  };

  const bookNow = () => {
    // Here you can call an API later: /api/bookings
    const total = qty * place.passInfo.price;

    Alert.alert(
      "Booking Confirmed!",
      `🎟 ${qty} Pass(es) booked\n💰 Total: ₹${total}`
    );

    navigation.goBack();
  };

  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Loading Pass...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Pass</Text>

      <Text style={styles.placeName}>{place.name}</Text>

      {/* Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        {place.images?.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Pass details */}
      <View style={styles.card}>
        <Text style={styles.section}>Pass Details</Text>

        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>₹{place.passInfo.price}</Text>

        <Text style={styles.label}>Validity:</Text>
        <Text style={styles.value}>{place.passInfo.validity}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{place.passInfo.details}</Text>
      </View>

      {/* Quantity Selector */}
      <View style={styles.qtyContainer}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => qty > 1 && setQty(qty - 1)}
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyNumber}>{qty}</Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQty(qty + 1)}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Total Price */}
      <Text style={styles.totalText}>
        Total: ₹{qty * place.passInfo.price}
      </Text>

      {/* Book Now */}
      <TouchableOpacity style={styles.bookBtn} onPress={bookNow}>
        <Text style={styles.bookText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  placeName: { fontSize: 20, fontWeight: "bold", marginTop: 10 },

  image: {
    width: 150,
    height: 120,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },

  section: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 16, marginTop: 5, fontWeight: "600" },
  value: { fontSize: 15 },

  qtyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  qtyText: { color: "white", fontSize: 20 },
  qtyNumber: { fontSize: 20, marginHorizontal: 20 },

  totalText: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "600",
  },

  bookBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  bookText: { color: "white", textAlign: "center", fontSize: 18 },
});
