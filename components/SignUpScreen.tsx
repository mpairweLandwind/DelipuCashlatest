import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const SignupScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/welcome.jpg')} style={styles.logo} />
        <Text style={styles.title}>DelipuCash</Text>
      </View>
      
      <Text style={styles.subtitle}>Already have an account?</Text>
      <Text style={styles.createAccountText}>Create NEW ACCOUNT</Text>
      
      <TextInput style={styles.input} placeholder="Firstname" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Lastname" placeholderTextColor="#888" />
      
      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="email/ phone number"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={true}
        />
      </View>
      
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>or</Text>
      
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
  createAccountText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#000',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#007B55',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007B55',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
});

export default SignupScreen;
