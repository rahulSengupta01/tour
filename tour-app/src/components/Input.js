import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function Input({ ...props }) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#777"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  }
});
