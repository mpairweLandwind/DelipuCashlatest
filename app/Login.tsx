import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { observer } from "mobx-react-lite";
import { authStore } from "@/store/AuthStore";
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const LoginScreen: React.FC = observer(() => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format.';
    if (!password.trim()) newErrors.password = 'Password is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateFields()) {
      try {
        await authStore.signIn(email, password);
        Toast.show({ text1: 'Login successful', type: 'success' });
        router.push('/(tabs)');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        Toast.show({ text1: 'Login failed', text2: errorMessage, type: 'error' });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logod.png')} style={styles.logo} />
        <Text style={styles.welcomeTitle}>Welcome to DelipuCash!</Text>
        <Text style={styles.subtitle}>Your Trusted Financial Partner</Text>
      </View>

      <View style={[styles.inputContainer, errors.email && styles.errorInput]}>
        <Fontisto name="email" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View style={[styles.inputContainer, errors.password && styles.errorInput]}>
        <EvilIcons name="lock" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity
        style={[styles.loginButton, authStore.loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={authStore.loading}
      >
        <Text style={styles.buttonText}>{authStore.loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        Don’t have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/Signup')}>
          Sign up here
        </Text>
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007B55',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    height: 50,
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007B55',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  linkText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;