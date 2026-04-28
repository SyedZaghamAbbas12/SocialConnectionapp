import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen({ navigation }) {

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch("http://192.168.100.18:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    setFullName(data.fullName || "");
    setUsername(data.username || "syed_zagham.01");
    setBio(data.bio || "");
    setAvatar(
      data.avatar
        ? `http://192.168.100.18:5000/${data.avatar}`
        : "https://i.pravatar.cc/300"
    );
  };

  // ✅ IMAGE PICKER
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg"
    });

    await fetch("http://192.168.100.18:5000/api/auth/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      body: formData
    });
  };

  // ✅ SAVE PROFILE
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://192.168.100.18:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, bio })
      });

      if (res.ok) {
        navigation.navigate("Profile", { refresh: true });
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* ✅ HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit profile</Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtnTop}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ PROFILE IMAGE */}
      <View style={styles.avatarContainer}>
        <Image
  source={{
    uri: avatar && avatar !== ""
      ? avatar
      : "https://i.pravatar.cc/300"
  }}
  style={styles.avatar}
/>

        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.editPhoto}>Edit picture or avatar</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ FORM FIELDS */}
      <View style={styles.inputBox}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          style={[styles.input, { height: 80 }]}
        />
      </View>

      {/* EXTRA SECTIONS (UI ONLY like Instagram) */}
      <Text style={styles.linkText}>Add link</Text>
      <Text style={styles.linkText}>Banners</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Gender</Text>
        <Text style={styles.input}>Man</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 15
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  saveBtnTop: {
    color: "#60a5fa",
    fontSize: 16,
    fontWeight: "bold"
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 25
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45
  },

  editPhoto: {
    color: "#60a5fa",
    marginTop: 10
  },

  inputBox: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15
  },

  label: {
    color: "#94a3b8",
    marginBottom: 5
  },

  input: {
    color: "#fff",
    fontSize: 16
  },

  linkText: {
    color: "#fff",
    marginVertical: 10,
    fontSize: 16
  }
});