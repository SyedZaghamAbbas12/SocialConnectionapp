import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#4A90E2",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
    </TouchableOpacity>
  );
}