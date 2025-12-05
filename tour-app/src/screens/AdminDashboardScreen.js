import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function AdminDashboardScreen({ navigation }) {
  const [place, setPlace] = useState(null);
  const [revenue, setRevenue] = useState({ today: 0, week: 0, month: 0 });
  const [bookings, setBookings] = useState([]);

  // Editable Fields
  const [price, setPrice] = useState("");
  const [validity, setValidity] = useState("");
  const [details, setDetails] = useState("");
  const [available, setAvailable] = useState(false);
  const [description, setDescription] = useState("");
  console.log("API_URL =>", API_URL);

  const loadData = async () => {
    const token = await AsyncStorage.getItem("adminToken");

    const placeRes = await axios.get(`${API_URL}/auth/admin/place`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPlace(placeRes.data);

    setPrice(String(placeRes.data.passInfo.price));
    setValidity(placeRes.data.passInfo.validity);
    setDetails(placeRes.data.passInfo.details);
    setAvailable(placeRes.data.passInfo.available);
    setDescription(placeRes.data.description);

    const revenueRes = await axios.get(
      `${API_URL}/auth/admin/dashboard/revenue`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRevenue(revenueRes.data);

    const bookingsRes = await axios.get(
      `${API_URL}/auth/admin/dashboard/bookings`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBookings(bookingsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------- UPDATE PASS INFO --------
  const updatePass = async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");

      await axios.put(
        `${API_URL}/auth/admin/place`,
        {
          passInfo: {
            available,
            price: Number(price),
            validity,
            details,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Pass Updated");
      loadData();
    } catch (err) {
      Alert.alert("Error", "Failed to update pass");
    }
  };

  // -------- UPDATE PLACE DESCRIPTION --------
  const updateDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");

      await axios.put(
        `${API_URL}/auth/admin/place`,
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Updated", "Description updated");
    } catch (err) {
      Alert.alert("Error", "Failed to update description");
    }
  };

  // -------- UPLOAD IMAGE --------
  const uploadImage = async () => {
    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (pick.canceled) return;

    const form = new FormData();
    form.append("image", {
      uri: pick.assets[0].uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    const token = await AsyncStorage.getItem("adminToken");

    const res = await axios.post(
      `${API_URL}/auth/admin/place/image`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    Alert.alert("Success", "Image uploaded");
    loadData();
  };

  if (!place) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{place.name} Admin Panel</Text>

      {/* ---------- REVENUE CARDS ---------- */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>₹{revenue.today}</Text>
          <Text style={styles.cardLabel}>Today</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>₹{revenue.week}</Text>
          <Text style={styles.cardLabel}>Week</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>₹{revenue.month}</Text>
          <Text style={styles.cardLabel}>Month</Text>
        </View>
      </View>

      {/* ---------- PASS MANAGEMENT ---------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pass Management</Text>

        <View style={styles.row}>
          <Text style={{ fontSize: 16 }}>Available</Text>
          <TouchableOpacity
            onPress={() => setAvailable(!available)}
            style={[
              styles.toggle,
              { backgroundColor: available ? "#4CAF50" : "#ccc" },
            ]}
          >
            <Text style={{ color: "white" }}>
              {available ? "YES" : "NO"}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Pass Price"
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          placeholder="Validity (e.g. 1 Day)"
          style={styles.input}
          value={validity}
          onChangeText={setValidity}
        />

        <TextInput
          placeholder="Pass Details"
          style={styles.input}
          value={details}
          onChangeText={setDetails}
        />

        <TouchableOpacity style={styles.button} onPress={updatePass}>
          <Text style={styles.buttonText}>Update Pass</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- PLACE MANAGEMENT ---------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Place Description</Text>

        <TextInput
          multiline
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.button} onPress={updateDetails}>
          <Text style={styles.buttonText}>Update Description</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- IMAGES ---------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Images</Text>

        <ScrollView horizontal>
          {place.images.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={styles.image}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- BOOKINGS ---------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>

        {bookings.length === 0 ? (
          <Text>No bookings yet.</Text>
        ) : (
          bookings.map((b) => (
            <View key={b._id} style={styles.bookingCard}>
              <Text style={styles.bookingAmount}>₹{b.amount}</Text>
              <Text>{new Date(b.createdAt).toLocaleString()}</Text>
              <Text>Pass: {b.passType}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    width: "32%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
  },

  cardValue: { fontSize: 20, color: "white", fontWeight: "bold" },
  cardLabel: { color: "white" },

  section: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },

  toggle: {
    padding: 8,
    borderRadius: 6,
    width: 70,
    alignItems: "center",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },

  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },

  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },

  bookingCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  bookingAmount: { fontWeight: "bold", fontSize: 18 },
});
