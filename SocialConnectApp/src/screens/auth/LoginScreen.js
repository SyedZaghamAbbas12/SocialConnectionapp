import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://192.168.100.18:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token;
        await AsyncStorage.setItem("token", token);

        alert("Login Successful ✅");
        navigation.navigate('Main');
      } else {
        alert(data.message || "Login failed");
      }

    } catch (error) {
      console.log(error);
      alert("Server Error ❌");
    }
  };

  return (
    <LinearGradient 
      colors={['#1e293b', '#0f172a', '#020617']} 
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >
          {/* Logo Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="flash" size={50} color="#00E5FF" />
            </View>
            <Text style={styles.title}>Social Connect</Text>
          </View>

          {/* Login Card */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
            />
            
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passwordWrapper}>
              <TextInput 
                style={styles.passwordInput} 
                secureTextEntry={!passwordVisible}
                placeholder="••••••••" 
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
              />
              
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons 
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotBtn} 
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={handleLogin}
            >
              <Text style={styles.loginBtnText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Bottom Row */}
            <View style={styles.signupRow}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>Signup</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  
  header: { alignItems: 'center', marginBottom: 40 },
  iconContainer: {
    shadowColor: '#00E5FF',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: '#fff', 
    marginTop: 15,
    letterSpacing: 0.5
  },

  card: { width: '100%', padding: 25 },
  
  label: { 
    color: '#94a3b8', 
    fontSize: 10, 
    fontWeight: 'bold', 
    letterSpacing: 1.5, 
    marginBottom: 8 
  },
  
  input: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    padding: 16, 
    color: '#fff', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 15,
  },

  passwordWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingRight: 15,
    marginBottom: 10
  },
  passwordInput: { 
    flex: 1, 
    padding: 16, 
    color: '#fff',
    fontSize: 15,
  },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#64748b', fontSize: 12 },

  loginBtn: { 
    height: 56, 
    borderRadius: 28, 
    borderWidth: 2, 
    borderColor: '#00E5FF', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  loginBtnText: { 
    color: '#00E5FF', 
    fontWeight: 'bold', 
    fontSize: 16, 
    letterSpacing: 2 
  },

  signupRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30 
  },
  noAccountText: { color: '#94a3b8', fontSize: 14 },
  signupText: { color: '#00E5FF', fontWeight: 'bold', fontSize: 14 }
});