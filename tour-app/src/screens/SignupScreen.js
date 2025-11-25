import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/authService";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const res = await registerUser({ name, mobile, password });

    console.log("Signup Response:", res);

    if (res?.token) {
      alert("Signup successful");
      navigation.navigate("Login");
    } else {
      alert(res?.msg || "Signup Failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <Input placeholder="Name" value={name} onChangeText={setName} />

      <Input placeholder="Mobile" value={mobile} onChangeText={setMobile} />

      <Input
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Create Account" onPress={handleSignup} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  link: { marginTop: 10, color: "blue", textAlign: "center" },
});
