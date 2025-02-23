import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import { authStore } from "./AuthStore";
import { format } from "date-fns";

export interface Question {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  responses: Response[];
}
export interface Response {
  id: string;
  responseText: string;
  userId: string;
  createdAt: string;
  questionId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
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
      // Fetch questions from the API
      const questions = await apiService.getQuestions();

            // Transform and update the state
      runInAction(() => {
        this.questions = questions.map((q: any) => ({
          id: q.id,
          text: q.text, // Corrected from `q.responseText` to `q.text`
          userId: q.userId,
          createdAt: q.createdAt ? format(new Date(q.createdAt), "MMM d, yyyy hh:mm a") : "Invalid Date",
          responses: q.responses || [],
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
        this.questions.unshift({
          ...newQuestion,        
          responses: []
        });
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
          question.responses = responses.map((response: any) => ({
            ...response,
            questionId, // Ensure questionId is included in each response
          }));
        });
      } else {
        console.warn(`Question with ID ${questionId} not found.`);
      }
    } catch (error) {
      console.error("Failed to fetch responses:", error);
    }
  }

  // Upload questions
  async uploadQuestions(questions: any) {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to upload questions.");
    }

    const isValid = questions.every((q: any) => q.text && q.userId);
    if (!isValid) {
      throw new Error("Invalid question format: Each question must have 'text' and 'userId'.");
    }

    try {
      const uploadedQuestions = await apiService.uploadQuestions(questions, userId);
      runInAction(() => {
        this.questions.unshift(...uploadedQuestions.map((q: any) => ({
          ...q,
          createdAt: format(new Date(q.createdAt), "MMM d, yyyy hh:mm a"),
          responses: [],
        })));
      });
    } catch (error) {
      console.error("Failed to upload questions:", error);
      throw error;
    }
  }

  // Submit a response to a question
  async submitResponse(questionId: string, responseText: string) {
  
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to submit a response.");
    }
  
    try {
      const newResponse = await apiService.submitResponse(questionId, responseText, userId);
      const question = this.questions.find((q) => q.id === questionId);
      if (question) {
        runInAction(() => {
          question.responses.unshift({
            ...newResponse,
            questionId, // Ensure questionId is included in the response object
          });
        });
      } else {
        console.warn(`Question with ID ${questionId} not found.`);
      }
    } catch (error) {
      console.error("Failed to submit response:", error);
      throw error;
    }
  }

}

export const questionStore = new QuestionStore();
