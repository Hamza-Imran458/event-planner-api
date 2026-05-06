import React, { useState } from 'react';
// Coursework 2 requirement: citation included for Justin Fletcher (see README).
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '../config/api';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import GradientButton from '../components/GradientButton';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function handleLogin(values) {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username.trim(), password: values.password }),
      });
      const data = await response.json();

      if (!response.ok || !data.token) {
        Alert.alert('Login failed', data.message || `HTTP ${response.status}`);
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('username', values.username.trim());

      navigation.replace('Events', {
        token: data.token,
        username: values.username.trim(),
      });
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
              <Text style={styles.title}>Event Planner</Text>
              <Text style={styles.subtitle}>Sign in to manage your schedule efficiently</Text>
            </View>

            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <GlassCard>
                  <View style={styles.inputContainer}>
                    <Input
                      icon={Mail}
                      placeholder="Username"
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      autoCapitalize="none"
                      error={errors.username}
                      touched={touched.username}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Input
                      icon={Lock}
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      showPasswordToggle
                      error={errors.password}
                      touched={touched.password}
                    />
                  </View>

                  <GradientButton
                    title={loading ? 'SIGNING IN...' : 'Sign In'}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.button}
                  />
                </GlassCard>
              )}
            </Formik>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
  registerLink: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '700',
  },
});
