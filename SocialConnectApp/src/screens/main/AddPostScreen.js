import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
const createPost = async () => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();

  formData.append("image", {
    uri: image,
    name: "post.jpg",
    type: "image/jpeg"
  });

  await fetch("http://192.168.100.18:5000/api/posts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },
    body: formData
  });

  alert("Post Added ✅");
};
  // ✅ Pick Image
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

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("Gallery permission required");

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Submit Post
  const submitPost = async () => {
    if (!image) return alert("Please select an image");
    if (!description) return alert("Please add a description");

    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "post.jpg",
        type: "image/jpeg"
      });
      formData.append("description", description);

      const res = await fetch("http://192.168.100.18:5000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        body: formData
      });

      if (res.ok) {
        alert("Post added successfully ✅");
        setImage(null);
        setDescription("");
        navigation.goBack();
      } else {
        alert("Failed to add post");
      }

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <LinearGradient colors={['#1e293b', '#0f172a', '#020617']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Add New Post</Text>
          </View>

          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="camera-outline" size={40} color="#00E5FF" />
                <Text style={{ color: '#fff', marginTop: 10 }}>Select Image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Description */}
          <TextInput
            style={styles.textInput}
            placeholder="Write a description..."
            placeholderTextColor="#94a3b8"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={submitPost}>
            <Text style={styles.submitText}>Post</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ✅ Styles matching ProfileScreen
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

  imagePicker: { 
    width: '100%', 
    height: 250, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#00E5FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20, 
    overflow: 'hidden'
  },
  imagePreview: { width: '100%', height: '100%', borderRadius: 20 },
  placeholder: { justifyContent: 'center', alignItems: 'center' },

  textInput: {
    width: '100%',
    minHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top'
  },

  submitBtn: { 
    backgroundColor: '#00E5FF',
    paddingVertical: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitText: { color: '#020617', fontWeight: 'bold', fontSize: 16 }
});