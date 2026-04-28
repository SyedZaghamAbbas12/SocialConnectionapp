import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, FlatList, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = "http://192.168.100.18:5000";

export default function ProfileScreen({ navigation, route }) {

  // 🔥 ADD THIS (IMPORTANT)
  const routeUserId = route?.params?.userId;

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    avatar: "",
    bio: ""
  });

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchPosts();
    }, [routeUserId])
  );

  // 🔥 FIXED PROFILE FETCH (SELF + OTHER USER)
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = routeUserId
        ? `${BASE_URL}/api/users/${routeUserId}`
        : `${BASE_URL}/api/auth/profile`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      setUser({
        fullName: data.fullName || "",
        email: data.email || "",
        avatar: data.avatar || "",
        bio: data.bio || ""
      });

    } catch (err) {
      console.log("Profile Error:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = routeUserId
        ? `${BASE_URL}/api/posts/user/${routeUserId}`
        : `${BASE_URL}/api/posts/my-posts`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setPosts(data);

    } catch (err) {
      console.log("Post Error:", err);
    }
  };

  const getAvatar = () => {
    if (!user.avatar) return "https://i.pravatar.cc/300";
    return `${BASE_URL}/uploads/${user.avatar}?t=${Date.now()}`;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg"
      });

      await fetch(`${BASE_URL}/api/auth/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      fetchProfile();

    } catch (err) {
      console.log("Upload Error:", err);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          navigation.replace("Login");
        }
      }
    ]);
  };

  return (
    <LinearGradient colors={['#1e293b', '#0f172a', '#020617']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ padding: 15 }}>

          {/* HEADER */}
          <View style={styles.topBar}>
            <Text style={styles.username}>{user.fullName || "Profile"}</Text>
            <Feather name="menu" size={24} color="#fff" />
          </View>

          {/* PROFILE */}
          <View style={styles.profileRow}>
            <View>
              <Image source={{ uri: getAvatar() }} style={styles.avatar} />

              {/* ONLY SHOW ADD BUTTON FOR OWN PROFILE */}
              {!routeUserId && (
                <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
                  <Ionicons name="add" size={18} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{posts.length}</Text>
                <Text style={styles.statText}>posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>0</Text>
                <Text style={styles.statText}>followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>0</Text>
                <Text style={styles.statText}>following</Text>
              </View>
            </View>
          </View>

          {/* BIO */}
          <Text style={styles.bioName}>{user.fullName}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          {/* BUTTONS (ONLY FOR OWN PROFILE) */}
          {!routeUserId && (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("EditProfile")}>
                <Text style={styles.btnText}>Edit profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Share profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* POSTS */}
          <FlatList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.post} />
            )}
          />

          {/* LOGOUT ONLY FOR OWN PROFILE */}
          {!routeUserId && (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45
  },
  addBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00E5FF",
    width: 25,
    height: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1
  },
  statItem: { alignItems: "center" },
  statNum: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  statText: { color: "#94a3b8" },
  bioName: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10
  },
  bio: {
    color: "#94a3b8",
    marginBottom: 10
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  btn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  btnText: { color: "#fff" },
  post: {
    width: "33%",
    height: 120
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});