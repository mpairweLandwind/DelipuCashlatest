import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import { authStore } from "./AuthStore";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";

export interface Survey {
  id: string;
  title: string;
  description: string;
  paymentOption: string;
  file?: DocumentPicker.DocumentPickerResult;
  userId: string;
}

class SurveyStore {
  surveys: Survey[] = [];
  loading: boolean = false;
  selectedFile: DocumentPicker.DocumentPickerResult | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Set the selected file for upload
  setSelectedFile(file: DocumentPicker.DocumentPickerResult | null) {
    this.selectedFile = file;
  }

  // Create a new survey
  async createSurvey(title: string, description: string, paymentOption: string) {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to create a survey.");
    }

    if (!title || !description || !paymentOption || !this.selectedFile) {
      throw new Error("Please fill all fields and select a file.");
    }

    this.loading = true;
    try {
      const surveyData = {
        title,
        description,
        paymentOption,
        file: this.selectedFile,
        userId,
      };

      const response = await apiService.createSurvey(surveyData);
      runInAction(() => {
        this.surveys.unshift(response); // Add the new survey to the top of the list
      });
      Toast.show({ type: "success", text1: "Success", text2: "Survey created successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to create survey." });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Fetch all surveys for the logged-in user
  async fetchSurveys() {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to fetch surveys.");
    }

    this.loading = true;
    try {
      const surveys = await apiService.getAllSurveys();
      runInAction(() => {
        this.surveys = surveys.filter((survey: Survey) => survey.userId === userId);
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to fetch surveys." });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const surveyStore = new SurveyStore();