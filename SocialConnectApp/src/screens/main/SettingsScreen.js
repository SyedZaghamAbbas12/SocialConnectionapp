import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }) {

  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Settings</Text>

      {/* EDIT PROFILE */}
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.editBtn}
      >
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutBtn}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30
  },

  editBtn: {
    backgroundColor: "#00E5FF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 15,
    width: 180,
    alignItems: "center",
    shadowColor: "#00E5FF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },

  editText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16
  },

  logoutBtn: {
    backgroundColor: "rgba(255, 77, 77, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: 180,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff4d4d"
  },

  logoutText: {
    color: "#ff4d4d",
    fontWeight: "bold",
    fontSize: 16
  }
});