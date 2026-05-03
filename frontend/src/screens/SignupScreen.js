import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Lock } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import GradientButton from '../components/GradientButton';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation', 'Username and password are required.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'Log In Now', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Register', data.message || `HTTP ${response.status}`);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#020617', '#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Set up your account to organize events</Text>
            </View>

            <GlassCard>
              <View style={styles.inputContainer}>
                <Input
                  icon={User}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  icon={Lock}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  showPasswordToggle
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  icon={Lock}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  showPasswordToggle
                />
              </View>

              <GradientButton
                title={loading ? 'CREATING ACCOUNT...' : 'Create Account'}
                onPress={register}
                disabled={loading}
                style={styles.button}
              />
            </GlassCard>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  inputContainer: {
    marginBottom: 12,
  },
  button: {
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  loginLink: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '700',
  }
});
