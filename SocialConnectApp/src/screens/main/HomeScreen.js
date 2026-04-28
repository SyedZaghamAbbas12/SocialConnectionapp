import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Pressable
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {

  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [commentText, setCommentText] = useState({});

  // 🔥 3 DOT MENU
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      getCurrentUser();
    }, [])
  );

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://192.168.100.18:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setCurrentUserId(data._id);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://192.168.100.18:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`http://192.168.100.18:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`http://192.168.100.18:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMenuVisible(false);
      fetchPosts();

    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const text = commentText[postId];

      if (!text) return;

      await fetch(`http://192.168.100.18:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      setCommentText(prev => ({ ...prev, [postId]: "" }));
      fetchPosts();

    } catch (err) {
      console.log(err);
    }
  };

  const openMenu = (post) => {
    setSelectedPost(post);
    setMenuVisible(true);
  };

  const filteredPosts = posts.filter(post =>
    post.userId?.fullName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderPost = ({ item }) => {

    const isLiked = item.likes?.includes(currentUserId);
    const isOwnPost = String(item.userId?._id) === String(currentUserId);

    return (
      <GlassCard style={styles.postCard}>

        {/* USER HEADER */}
        <View style={styles.userRow}>
          <View style={styles.leftUser}>

            <Image
              source={{
                uri: item.userId?.avatar
                  ? `http://192.168.100.18:5000/uploads/${item.userId.avatar}`
                  : "https://i.pravatar.cc/150"
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.userName}>{item.userId?.fullName}</Text>
              <Text style={styles.timeText}>Now</Text>
            </View>

          </View>

          {/* 3 DOTS */}
          <TouchableOpacity onPress={() => openMenu(item)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>

        </View>

        {/* POST TEXT */}
        <Text style={styles.postContent}>{item.description}</Text>

        {/* IMAGE */}
        <Image
          source={{
            uri: item.image
              ? `http://192.168.100.18:5000/uploads/${item.image}`
              : 'https://via.placeholder.com/150'
          }}
          style={styles.postImage}
        />

        {/* ACTIONS */}
        <View style={styles.actionRow}>

          {/* LIKE */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleLike(item._id)}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? "red" : "#fff"}
            />
            <Text style={styles.actionText}>
              {item.likes?.length || 0}
            </Text>
          </TouchableOpacity>

          {/* COMMENT */}
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

        </View>

        {/* COMMENT BOX */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>

          <TextInput
            placeholder="Write comment..."
            placeholderTextColor="#999"
            value={commentText[item._id] || ""}
            onChangeText={(text) =>
              setCommentText(prev => ({ ...prev, [item._id]: text }))
            }
            style={styles.commentBox}
          />

          <TouchableOpacity
            onPress={() => handleComment(item._id)}
            style={styles.sendBtn}
          >
            <Text style={{ color: "#000" }}>Send</Text>
          </TouchableOpacity>

        </View>

      </GlassCard>
    );
  };

  return (
    <LinearGradient colors={['#1e293b', '#0f172a', '#020617']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Social Connect</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
        />

        {/* 🔥 3 DOT MENU MODAL */}
        <Modal visible={menuVisible} transparent animationType="fade">
          <Pressable style={styles.modalBg} onPress={() => setMenuVisible(false)}>

            <View style={styles.modalBox}>

              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("AddPost", { edit: true, post: selectedPost });
                }}
              >
                <Text style={styles.modalText}>✏️ Edit Post</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(selectedPost?._id)}
              >
                <Text style={[styles.modalText, { color: "red" }]}>
                  🗑 Delete Post
                </Text>
              </TouchableOpacity>

            </View>

          </Pressable>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },

  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    margin: 10,
    padding: 10,
    borderRadius: 10
  },

  searchInput: { flex: 1, color: "#fff", marginLeft: 10 },

  postCard: { margin: 10, padding: 15 },

  userRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  leftUser: { flexDirection: "row", alignItems: "center" },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  userName: { color: "#fff", fontWeight: "bold" },

  timeText: { color: "#aaa", fontSize: 12 },

  postContent: { color: "#fff", marginVertical: 10 },

  postImage: { width: "100%", height: 200, borderRadius: 10 },

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between"
  },

  actionBtn: { flexDirection: "row", alignItems: "center" },

  actionText: { color: "#fff", marginLeft: 5 },

  commentBox: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 8,
    borderRadius: 8
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#00E5FF",
    padding: 10,
    borderRadius: 8
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 10,
    width: 200
  },

  modalText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 10
  }

});