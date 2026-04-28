import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const BASE_URL = "http://192.168.100.18:5000";

export default function ChatScreen({ navigation }) {

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      // 👤 current user
      const me = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCurrentUser(me.data);

      // 👥 users list
      const res = await axios.get(`${BASE_URL}/api/users/search?q=`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data || [];

      setUsers(data);
      setAllUsers(data);

    } catch (err) {
      console.log("Chat load error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

 const searchUsers = (text) => {
  setSearch(text);

  if (!text || !text.trim()) {
    setUsers(allUsers);
    return;
  }

  const filtered = allUsers.filter(user =>
    user?.fullName?.toLowerCase().includes(text.toLowerCase())
  );

  setUsers(filtered);
};

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.header}>
        {currentUser?.fullName || "Chats"}
      </Text>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Icon name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Search user..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={search}
          onChangeText={searchUsers}
        />
      </View>

      {/* LOADING */}
      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
          Loading users...
        </Text>
      ) : null}

      {/* USERS */}
      <FlatList
        data={users}
        keyExtractor={(item) => item?._id}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
            No users found
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userRow}
            onPress={() =>
              navigation.navigate("ChatDetail", { user: item })
            }
          >
            <Image
              source={{
                uri: item?.avatar
                  ? `${BASE_URL}/uploads/${item.avatar}`
                  : 'https://via.placeholder.com/50'
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.name}>
                {item?.fullName || "User"}
              </Text>
              <Text style={styles.sub}>Tap to chat</Text>
            </View>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 12
  },

  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10
  },

  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 10
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222'
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  sub: {
    color: '#aaa',
    fontSize: 13
  }
});