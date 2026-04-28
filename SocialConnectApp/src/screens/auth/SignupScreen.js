import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';

export default function SignupScreen({ navigation }) {

  // ✅ STATES
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ NEW STATE FOR EYE TOGGLE
  const [showPassword, setShowPassword] = useState(false);

  // ✅ SIGNUP FUNCTION
  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://192.168.100.18:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account Created ✅");
        navigation.navigate('Login');
      } else {
        alert(data.message || "Signup failed");
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
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
            
            {/* Header Section */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Create Account</Text>
            </View>

            {/* Signup Card */}
            <GlassCard style={styles.card}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your full name" 
                placeholderTextColor="#64748b"
                value={fullName}
                onChangeText={setFullName}
              />

              <Text style={styles.label}>EMAIL</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your email" 
                placeholderTextColor="#64748b" 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordWrapper}>
                <TextInput 
                  style={styles.passwordInput} 
                  secureTextEntry={!showPassword}
                  placeholder="••••••••" 
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.signupBtn} 
                onPress={handleSignup}
              >
                <Text style={styles.signupBtnText}>SIGN UP</Text>
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.alreadyText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLinkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollInner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backBtn: { marginRight: 10 },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  card: { width: '100%', padding: 25 },
  label: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 8 },
  input: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    padding: 16, 
    color: '#fff', 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)' 
  },
  passwordWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    paddingRight: 15, 
    marginBottom: 30 
  },
  passwordInput: { flex: 1, padding: 16, color: '#fff' },
  signupBtn: { 
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
  signupBtnText: { color: '#00E5FF', fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  alreadyText: { color: '#94a3b8', fontSize: 14 },
  loginLinkText: { color: '#00E5FF', fontWeight: 'bold' }
});