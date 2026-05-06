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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '../config/api';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import GradientButton from '../components/GradientButton';

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function SignupScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function handleRegister(values) {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username.trim(), password: values.password }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'Log In Now', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Register failed', data.message || `HTTP ${response.status}`);
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

            <Formik
              initialValues={{ username: '', password: '', confirmPassword: '' }}
              validationSchema={signupSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <GlassCard>
                  <View style={styles.inputContainer}>
                    <Input
                      icon={User}
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

                  <View style={styles.inputContainer}>
                    <Input
                      icon={Lock}
                      placeholder="Confirm Password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      showPasswordToggle
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                    />
                  </View>

                  <GradientButton
                    title={loading ? 'CREATING ACCOUNT...' : 'Create Account'}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.button}
                  />
                </GlassCard>
              )}
            </Formik>

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
  },
});
