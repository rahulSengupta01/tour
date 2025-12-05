// tour-app/src/screens/SuperAdminDashboard.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function SuperAdminDashboard({ navigation }) {
  const [places, setPlaces] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [placeName, setPlaceName] = useState("");
  const [placeDesc, setPlaceDesc] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [adminName, setAdminName] = useState("");
  const [adminMobile, setAdminMobile] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");

  const loadData = async () => {
    const token = await AsyncStorage.getItem("adminToken");

    try {
      const p = await axios.get(`${API_URL}/auth/admin/places`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const a = await axios.get(`${API_URL}/auth/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlaces(p.data);
      setAdmins(a.data);
    } catch (err) {
      console.log("LOAD DATA ERROR:", err);
      Alert.alert("Error", "Failed loading data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPlace = async () => {
    const token = await AsyncStorage.getItem("adminToken");

    const body = {
      name: placeName,
      description: placeDesc,
      location: {
        lat: Number(lat),
        lon: Number(lon),
      },
    };

    try {
      await axios.post(`${API_URL}/auth/admin/place/create`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Place created");
      setPlaceName("");
      setPlaceDesc("");
      setLat("");
      setLon("");
      loadData();
    } catch (err) {
      console.log("CREATE PLACE ERROR:", err.response?.data || err);
      Alert.alert("Error", err.response?.data?.msg || "Failed to create place");
    }
  };

  const createAdmin = async () => {
    if (!selectedPlace) return Alert.alert("Error", "Select a place for admin");

    const token = await AsyncStorage.getItem("adminToken");

    const body = {
      name: adminName,
      mobile: adminMobile,
      password: adminPassword,
      place_id: selectedPlace,
    };

    try {
      await axios.post(`${API_URL}/auth/admin/admin/create`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Admin created");

      setAdminName("");
      setAdminMobile("");
      setAdminPassword("");
      setSelectedPlace("");

      loadData();
    } catch (err) {
      console.log("CREATE ADMIN ERROR:", err.response?.data || err);
      Alert.alert("Error", err.response?.data?.msg || "Failed to create admin");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Superadmin Dashboard</Text>

      {/* CREATE PLACE */}
      <Text style={styles.header}>Create Place</Text>

      <TextInput
        placeholder="Place Name"
        style={styles.input}
        value={placeName}
        onChangeText={setPlaceName}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={placeDesc}
        onChangeText={setPlaceDesc}
      />

      <TextInput
        placeholder="Latitude"
        keyboardType="numeric"
        style={styles.input}
        value={lat}
        onChangeText={setLat}
      />

      <TextInput
        placeholder="Longitude"
        keyboardType="numeric"
        style={styles.input}
        value={lon}
        onChangeText={setLon}
      />

      <TouchableOpacity style={styles.btn} onPress={createPlace}>
        <Text style={styles.btnText}>Create Place</Text>
      </TouchableOpacity>

      {/* CREATE ADMIN */}
      <Text style={styles.header}>Create Admin</Text>

      <TextInput
        placeholder="Admin Name"
        style={styles.input}
        value={adminName}
        onChangeText={setAdminName}
      />

      <TextInput
        placeholder="Admin Mobile"
        style={styles.input}
        value={adminMobile}
        onChangeText={setAdminMobile}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={adminPassword}
        onChangeText={setAdminPassword}
      />

      {/* Select Place */}
      <Text style={styles.subHeader}>Select Place</Text>
      {places.map((p) => (
        <TouchableOpacity
          key={p._id}
          style={[
            styles.placeSelector,
            selectedPlace === p._id && { backgroundColor: "#cce5ff" },
          ]}
          onPress={() => setSelectedPlace(p._id)}
        >
          <Text>{p.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.btn} onPress={createAdmin}>
        <Text style={styles.btnText}>Create Admin</Text>
      </TouchableOpacity>

      {/* LIST OF PLACES */}
      <Text style={styles.header}>All Places</Text>
      {places.map((p) => (
        <Text key={p._id} style={styles.listItem}>
          • {p.name}
        </Text>
      ))}

      {/* LIST OF ADMINS */}
      <Text style={styles.header}>All Admins</Text>
      {admins.map((a) => (
        <Text key={a._id} style={styles.listItem}>
          • {a.name} ({a.mobile}) → {a.place_id?.name || "No Place"}
        </Text>
      ))}
    </ScrollView>
  );
}

// ----------- Styles -----------
const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  header: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
  subHeader: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "bold" },
  listItem: { marginVertical: 5, fontSize: 16 },
  placeSelector: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 5,
  },
});
