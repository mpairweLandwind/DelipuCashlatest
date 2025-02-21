import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { apiService } from "@/utils/api";

// Define the Auth Context
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void; // New function for updating user details
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAuthState = async () => {
      setLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        Toast.show({ type: "error", text1: "Error", text2: "Failed to load authentication state." });
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      AsyncStorage.setItem("user", JSON.stringify(updatedUser)); // Persist updated user to storage
      return updatedUser;
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiService.signInUser(email, password);
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        Toast.show({ type: "success", text1: "Success", text2: "Signed in successfully!" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Sign-In Failed", text2: "Invalid email or password." });
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    setLoading(true);
    try {
      const data = await apiService.signUpUser(email, password, firstName, lastName, phone);
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        Toast.show({ type: "success", text1: "Success", text2: "Account created successfully!" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign-Up Failed",
        text2: "Something went wrong, please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiService.logout();
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      Toast.show({ type: "success", text1: "Success", text2: "Logged out successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Logout Failed", text2: "Please try again." });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, token, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};
