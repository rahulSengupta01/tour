// tour-app/src/screens/AdminLoginScreen.js

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLoginScreen({ navigation }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    if (!mobile || !password) {
      return Alert.alert("Error", "Please enter mobile & password");
    }

    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, {
        mobile,
        password,
      });

      if (!res.data.token) return Alert.alert("Login Failed");

      // Save admin token + place id
      await AsyncStorage.setItem("adminToken", res.data.token);
      await AsyncStorage.setItem("adminPlaceId", String(res.data.place_id));

      Alert.alert("Success", "Admin Login Successful");

      if (res.data.role === "superadmin") {
        navigation.replace("SuperAdminDashboard");
      } else {
        navigation.replace("AdminDashboard");
      }
    } catch (err) {
      console.log("ADMIN LOGIN ERROR:", err.response?.data || err);
      Alert.alert("Login Failed", "Invalid mobile or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <Input
        placeholder="Admin Mobile"
        value={mobile}
        onChangeText={setMobile}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login as Admin" onPress={handleAdminLogin} />

      <TouchableOpacity
        style={{ marginTop: 15 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.link}>← Back to User Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  link: { color: "blue", textAlign: "center", marginTop: 10 },
});
