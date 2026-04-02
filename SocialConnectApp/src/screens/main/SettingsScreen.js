import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../utils/theme";

export default function SettingsScreen({ setIsLoggedIn }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
      <Text style={{ fontSize: 20 }}>Settings</Text>

      <TouchableOpacity
        onPress={() => setIsLoggedIn(false)}
        style={{ backgroundColor: "red", padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: "#fff" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}