import { apiService } from "@/utils/api";
import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ApiStore {
  user: any = null;
  token: string | null = null;
  surveys: any[] = [];
  videos: any[] = [];
  rewards: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadToken();
  }

  async loadToken() {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      runInAction(() => {
        this.token = storedToken;
      });
    } catch (err: unknown) {
      this.handleError(err, "Failed to load token.");
    }
  }



  async fetchSurveys() {
    this.isLoading = true;
    try {
      const data = await apiService.getAllSurveys();
      runInAction(() => {
        this.surveys = data;
      });
    } catch (err: unknown) {
      this.handleError(err, "Failed to fetch surveys.");
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async fetchVideos() {
    this.isLoading = true;
    try {
      const data = await apiService.getAllVideos();
      runInAction(() => {
        this.videos = data;
      });
    } catch (err: unknown) {
      this.handleError(err, "Failed to fetch videos.");
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async fetchRewards() {
    this.isLoading = true;
    try {
      const data = await apiService.getRewards();
      runInAction(() => {
        this.rewards = data;
      });
    } catch (err: unknown) {
      this.handleError(err, "Failed to fetch rewards.");
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  private handleError(err: unknown, defaultMessage: string) {
    let errorMessage = defaultMessage;
    if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = String(err);
    }
    runInAction(() => {
      this.error = errorMessage;
    });
  }
}

export const apiStore = new ApiStore();
