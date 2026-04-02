import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {

  const [user, setUser] = useState({
    fullName: "Syed Zagham Abbas",
    email: "",
    avatar: ""
  });

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch("http://192.168.100.18:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        setUser({
          fullName: data.fullName || "Syed Zagham Abbas",
          email: data.email || "",
          avatar: data.avatar || ""
        });

      } catch (error) {
        console.log(error);
        // fallback default values
        setUser({
          fullName: "Syed Zagham Abbas",
          email: "",
          avatar: ""
        });
      }
    };

    fetchProfile();
  }, []);

  // ✅ PICK IMAGE OPTIONS
  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return alert("Camera permission required");

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("Gallery permission required");

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  // ✅ UPLOAD IMAGE
  const uploadImage = async (imageUri) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("avatar", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg"
      });

      const res = await fetch("http://192.168.100.18:5000/api/auth/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setUser(prev => ({
          ...prev,
          avatar: data.avatar || prev.avatar
        }));
        alert("Image updated ✅");
      } else {
        alert("Upload failed");
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://192.168.100.18:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.email
        })
      });

      if (res.ok) {
        alert("Profile updated ✅");
      } else {
        alert("Update failed");
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={['#1e293b', '#0f172a', '#020617']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => alert("Settings Coming Soon")}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: user.avatar || 'https://i.pravatar.cc/300' }} 
                style={styles.avatar} 
              />

              {/* ✅ CLICKABLE + BUTTON */}
              <TouchableOpacity style={styles.addBadge} onPress={pickImage}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {/* ✅ Editable Name & Email */}
            <TextInput
              style={styles.userName}
              value={user.fullName || "Syed Zagham Abbas"}
              onChangeText={(text) => setUser({ ...user, fullName: text })}
            />

            <TextInput
              style={styles.userBio}
              value={user.email || ""}
              onChangeText={(text) => setUser({ ...user, email: text })}
            />

            {/* ✅ SAVE BUTTON */}
            <TouchableOpacity onPress={updateProfile}>
              <Text style={{ color: '#00E5FF', marginTop: 10 }}>Save Profile</Text>
            </TouchableOpacity>

          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <GlassCard style={styles.statBox}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </GlassCard>
            <GlassCard style={styles.statBox}>
              <Text style={styles.statNumber}>450</Text>
              <Text style={styles.statLabel}>Following</Text>
            </GlassCard>
          </View>

          {/* Menu */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={22} color="#00E5FF" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#475569" style={styles.chevron} />
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 30 
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  profileImageContainer: { alignItems: 'center', marginBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 3, 
    borderColor: '#00E5FF' 
  },
  addBadge: { 
    position: 'absolute', 
    bottom: 5, 
    right: 5, 
    backgroundColor: '#00E5FF', 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f172a'
  },
  userName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  userBio: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 5 },

  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#64748b', fontSize: 12 },

  menuSection: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 20, 
    padding: 10,
    marginBottom: 30 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  menuText: { color: '#fff', marginLeft: 15, fontSize: 16 },
  chevron: { marginLeft: 'auto' },

  logoutBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 77, 77, 0.1)'
  },
  logoutText: { color: '#ff4d4d', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});