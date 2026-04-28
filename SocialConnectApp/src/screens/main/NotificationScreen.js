import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.100.18:5000";

export default function NotificationScreen() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setNotifications(data);

    } catch (err) {
      console.log("Notification error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <Image
        source={{
          uri: item.senderId?.avatar
            ? `${BASE_URL}/uploads/${item.senderId.avatar}`
            : "https://i.pravatar.cc/100"
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>
            {item.senderId?.fullName || "User"}
          </Text>{" "}
          {item.text}
        </Text>

        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>

    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
            No notifications
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 10 },

  card: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    alignItems: "center"
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12
  },

  text: {
    color: "#fff",
    fontSize: 14
  },

  time: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4
  }
});