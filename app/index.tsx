import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const SplashScreen = () => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const router = useRouter(); // Initialize the router

  // Check if user is authenticated (for demonstration, assuming `isAuthenticated` flag)
  const isAuthenticated = false; // You can replace this with your actual authentication logic

  useEffect(() => {
    // Navigate after the splash screen animations complete
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate based on authentication status after 3 seconds
    setTimeout(() => {
   
        router.push('/(tabs)'); // Navigate to the home screen
     
    }, 5000); // 3 seconds for splash screen
  }, [fadeAnimation, scaleAnimation, router, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          { opacity: fadeAnimation, fontSize: isSmallScreen ? 20 : 28 },
        ]}
      >
        DelipuCash
      </Animated.Text>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnimation,
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/logod.png")}
          style={[
            styles.image,
            { width: isSmallScreen ? 150 : 200, height: isSmallScreen ? 150 : 200 },
          ]}
        />
      </Animated.View>
      <View style={styles.bottomContainer}>
        <Animated.Text
          style={[
            styles.subtitle,
            { opacity: fadeAnimation, fontSize: isSmallScreen ? 14 : 16 },
          ]}
        >
          Discover featured Videos, Surveys, and Questions for rewards
        </Animated.Text>
        <TouchableOpacity style={styles.button}   onPress={() => router.push('/(tabs)')} >
          <Text style={[styles.buttonText, { fontSize: isSmallScreen ? 14 : 16 }]}>
            Explore
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    resizeMode: "contain",
  },
  bottomContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    color: "#BBBBBB",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#005F3F",
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SplashScreen;
