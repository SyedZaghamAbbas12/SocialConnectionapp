import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../../socket";

const BASE_URL = "http://192.168.100.18:5000";

export default function ChatDetailScreen({ route }) {
  const { user } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    init();

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const init = async () => {
    const token = await AsyncStorage.getItem("token");

    const me = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCurrentUser(me.data);

    socket.emit("join", me.data._id);

    const res = await axios.get(`${BASE_URL}/api/messages/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMessages(res.data);

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const token = await AsyncStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/api/messages`,
      { receiverId: user._id, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    socket.emit("sendMessage", {
      senderId: currentUser?._id,
      receiverId: user._id,
      text
    });

    setMessages(prev => [...prev, res.data]);
    setText("");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>{user.fullName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <Text style={[
            styles.msg,
            item.senderId === currentUser?._id && styles.myMsg
          ]}>
            {item.text}
          </Text>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.send}>Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 10 },

  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  msg: {
    color: "#fff",
    padding: 10,
    backgroundColor: "#222",
    marginVertical: 4,
    borderRadius: 10,
    maxWidth: "70%"
  },

  myMsg: {
    backgroundColor: "#00E5FF",
    alignSelf: "flex-end",
    color: "#000"
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },

  input: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    color: "#fff",
    padding: 10,
    borderRadius: 10
  },

  send: {
    color: "#00E5FF",
    marginLeft: 10,
    fontWeight: "bold"
  }
});