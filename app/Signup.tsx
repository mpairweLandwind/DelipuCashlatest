import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { authStore } from '@/store/AuthStore';

const { width } = Dimensions.get('window');

const SignupScreen: React.FC = observer(() => {
  const router = useRouter();
  const { signUp, loading } = authStore;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstname] = useState('');
  const [phone, setPhone] = useState('');
  const [lastName, setLastname] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Invalid phone number.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long.';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required.';
    else if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validateFields()) {
      try {
        await signUp(email, password, firstName,lastName,phone );
        Toast.show({ text1: 'Registration successful', type: 'success' });
        router.push('/Login');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        Toast.show({ text1: 'Registration failed', text2: errorMessage, type: 'error' });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logod.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to DelipuCash</Text>
      </View>

      <TextInput
        style={[styles.input, errors.firstName && styles.errorInput]}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstname}
      />
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

      <TextInput
        style={[styles.input, errors.lastName && styles.errorInput]}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastname}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

      <View style={[styles.inputContainer, errors.phone && styles.errorInput]}>
        <Feather name="phone" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Phone"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

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

      <View style={[styles.inputContainer, errors.confirmPassword && styles.errorInput]}>
        <EvilIcons name="lock" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <TouchableOpacity
        style={[styles.registerButton, loading && styles.disabledButton]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Create Account'}</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'space-evenly',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007B55',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#007B55',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 14,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#000',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
});

export default SignupScreen;
