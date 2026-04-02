import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      const res = await fetch("http://192.168.100.18:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success ✅", "Password reset link sent to your email");
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Server Error ❌");
    }
  };

  return (
    <LinearGradient 
      colors={['#1e293b', '#0f172a', '#020617']} 
      style={styles.container}
    >
        <TouchableOpacity 
  onPress={() => navigation.goBack()} 
  style={styles.backBtnRow}
>
  <Ionicons name="arrow-back" size={20} color="#00E5FF" />
  <Text style={{ color: '#00E5FF', marginLeft: 6 }}>Back</Text>
</TouchableOpacity>
      <View style={styles.inner}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.btn} onPress={handleForgotPassword}>
          <Text style={styles.btnText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  inner: { padding: 25 },

  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center'
  },
backBtn: {
  position: 'absolute',
  top: 50,
  left: 20,
  width: 45,
  height: 45,
  borderRadius: 22,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)',

  // Glow effect (same theme)
  shadowColor: '#00E5FF',
  shadowOpacity: 0.6,
  shadowRadius: 10,
  elevation: 8,
},
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },

  btn: {
    backgroundColor: '#00E5FF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center'
  },

  btnText: {
    color: '#000',
    fontWeight: 'bold'
  }
});