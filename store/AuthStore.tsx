import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { apiService } from "@/utils/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  subscriptionStatus?: "active" | "inactive";
}

class AuthStore {
  [x: string]: any;
  user: User | null = null;
  token: string | null = null;
  loading: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.loadAuthState();
  }

  async loadAuthState() {
    this.loading = true;
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        runInAction(() => {
          this.token = storedToken;
          this.user = JSON.parse(storedUser);
        });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to load authentication state." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setUser(user: User | null) {
    this.user = user;
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  }

  updateUser(updates: Partial<User>) {
    if (!this.user) return;

    const updatedUser = { ...this.user, ...updates };
    runInAction(() => {
      this.user = updatedUser;
    });
    AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  }


  async updateSubscriptionStatus(status: "active" | "inactive") {
    if (!this.user) return;

    try {
      await apiService.updateSubscriptionStatus(this.user.id, status);
      runInAction(() => {
        this.user!.subscriptionStatus = status;
      });
      await AsyncStorage.setItem("user", JSON.stringify(this.user));
      Toast.show({ type: "success", text1: "Success", text2: "Subscription status updated successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to update subscription status." });
    }
  }

  async signIn(email: string, password: string) {
    this.loading = true;
    try {
      const data = await apiService.signInUser(email, password);
      if (data?.token) {
        runInAction(() => {
          this.token = data.token;
          this.user = data.user;
        });

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Toast.show({ type: "success", text1: "Success", text2: "Signed in successfully!" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Sign-In Failed", text2: "Invalid email or password." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async signUp(email: string, password: string, firstName: string, lastName: string, phone: string) {
    this.loading = true;
    try {
      const data = await apiService.signUpUser(email, password, firstName, lastName, phone);
      if (data?.token) {
        runInAction(() => {
          this.token = data.token;
          this.user = data.user;
        });

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Toast.show({ type: "success", text1: "Success", text2: "Account created successfully!" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Sign-Up Failed", text2: "Something went wrong, please try again." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async logout() {
    this.loading = true;
    try {
      await apiService.logout();

      runInAction(() => {
        this.user = null;
        this.token = null;
      });

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      Toast.show({ type: "success", text1: "Success", text2: "Logged out successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Logout Failed", text2: "Please try again." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const authStore = new AuthStore();
