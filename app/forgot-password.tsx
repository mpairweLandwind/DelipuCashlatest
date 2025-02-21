import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const ForgotPassword: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Logic for password reset
    console.log(`Reset password link sent to: ${email}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logod.png')} // Replace with your logo
            style={[
              styles.logo,
              {
                width: width > 600 ? RFValue(120) : RFValue(100),
                height: width > 600 ? RFValue(120) : RFValue(100),
              },
            ]}
          />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we’ll send you a link to reset your password.
          </Text>
        </View>

        {/* Email Input Section */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#7D7D7D" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { paddingVertical: width > 600 ? RFValue(15) : RFValue(12) },
          ]}
          onPress={handleResetPassword}
        >
          <Text style={[styles.buttonText, { fontSize: RFPercentage(2.2) }]}>
            Send Reset Link
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { fontSize: RFPercentage(1.8) }]}>
            Remember your password?
          </Text>
          <Link href="/Login" style={[styles.linkText, { fontSize: RFPercentage(1.8) }]}>
            Log In
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  header: {
    alignItems: 'center',
    marginBottom: RFPercentage(5),
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: RFPercentage(2),
  },
  title: {
    fontSize: RFPercentage(3.5),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: RFPercentage(1),
  },
  subtitle: {
    fontSize: RFPercentage(2),
    color: '#707070',
    textAlign: 'center',
    marginHorizontal: RFPercentage(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: RFPercentage(1.5),
    paddingHorizontal: RFPercentage(2),
  },
  icon: {
    marginRight: RFPercentage(1),
  },
  input: {
    flex: 1,
    fontSize: RFPercentage(2),
    color: '#000000',
  },
  button: {
    backgroundColor: '#005F3F',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: RFPercentage(2),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFPercentage(2),
  },
  footerText: {
    color: '#707070',
  },
  linkText: {
    color: '#005F3F',
    fontWeight: 'bold',
    marginLeft: RFPercentage(0.5),
  },
});

export default ForgotPassword;
