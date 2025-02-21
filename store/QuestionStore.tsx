import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import { authStore } from "./AuthStore";
import { format } from "date-fns";
import { ReactNode } from "react";

export interface Question {
  createdAt: ReactNode;
  id: string;
  text: string;
  userId: string;
  responses: Response[];
}

export interface Response {
  id: string;
  text: string;
  userId: string;
  questionId: string;
}

class QuestionStore {
  questions: Question[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all questions
  async fetchQuestions() {
    this.loading = true;
    try {
      const questions = await apiService.getQuestions();
      runInAction(() => {
        this.questions = questions.map((q: { id: any; text: any; userId: any; createdAt: string | number | Date; }) => ({
          id: q.id,
          text: q.text,
          userId: q.userId,
          createdAt: format(new Date(q.createdAt), "MMM d, yyyy hh:mm a"), // Format timestamp
          responses: [], // Initialize an empty array for responses
        }));
      });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Submit a new question
  async submitQuestion(text: string) {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to submit a question.");
    }

    try {
      const newQuestion = await apiService.submitQuestion(text, userId);
      runInAction(() => {
        this.questions.unshift(newQuestion); // Add to the top of the list
      });
    } catch (error) {
      console.error("Failed to submit question:", error);
      throw error;
    }
  }

  // Fetch responses for a specific question
  async fetchResponses(questionId: string) {
    try {
      const responses = await apiService.getResponsesForQuestion(questionId);
      const question = this.questions.find((q) => q.id === questionId);
      if (question) {
        runInAction(() => {
          question.responses = responses;
        });
      }
    } catch (error) {
      console.error("Failed to fetch responses:", error);
    }
  }

  async uploadQuestions(questions: any) {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to upload questions.");
    }
  
    try {
      const uploadedQuestions = await apiService.uploadQuestions(questions, userId);
      runInAction(() => {
        this.questions.unshift(...uploadedQuestions); // Add to the top of the list
      });
    } catch (error) {
      console.error("Failed to upload questions:", error);
      throw error;
    }
  }
  

  // Submit a response to a question
  async submitResponse(questionId: string, text: string) {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to submit a response.");
    }

    try {
      const newResponse = await apiService.submitResponse(questionId, text, userId);
      const question = this.questions.find((q) => q.id === questionId);
      if (question) {
        runInAction(() => {
          question.responses.unshift(newResponse); // Add to the top of the list
        });
      }
    } catch (error) {
      console.error("Failed to submit response:", error);
      throw error;
    }
  }
}

export const questionStore = new QuestionStore();
