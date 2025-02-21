import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import { authStore } from "./AuthStore";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

export interface Question {
  question: string;
  type: "text" | "radio" | "checkbox" | "multiple-choice";
  options?: string[];
}

export interface SurveyFormValues {
  surveyTitle: string;
  questions: Question[];
}

class SurveyFormStore {
  surveyFormValues: SurveyFormValues = {
    surveyTitle: "",
    questions: [{ question: "", type: "text", options: [] }],
  };
  loading: boolean = false;
  errors: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  // Update form values
  updateFormValues(values: Partial<SurveyFormValues>) {
    runInAction(() => {
      this.surveyFormValues = { ...this.surveyFormValues, ...values };
    });
  }

  // Add a new question
  addQuestion() {
    runInAction(() => {
      this.surveyFormValues.questions.push({
        question: "",
        type: "text",
        options: [],
      });
    });
  }

  // Remove a question
  removeQuestion(index: number) {
    runInAction(() => {
      this.surveyFormValues.questions.splice(index, 1);
    });
  }

  // Add an option to a question
  addOption(questionIndex: number) {
    runInAction(() => {
      this.surveyFormValues.questions[questionIndex].options?.push("");
    });
  }

  // Remove an option from a question
  removeOption(questionIndex: number, optionIndex: number) {
    runInAction(() => {
      this.surveyFormValues.questions[questionIndex].options?.splice(optionIndex, 1);
    });
  }

  // Validate the form
  async validateForm() {
    const validationSchema = Yup.object({
      surveyTitle: Yup.string().required("Survey title is required"),
      questions: Yup.array()
        .of(
          Yup.object({
            question: Yup.string().required("Question is required"),
            type: Yup.string()
              .oneOf(["text", "radio", "checkbox", "multiple-choice"])
              .required("Question type is required"),
            options: Yup.array()
              .of(Yup.string().required("Option is required"))
              .min(2, "At least two options are required")
              .when("type", {
                is: (type: string) =>
                  ["radio", "checkbox", "multiple-choice"].includes(type),
                then: (schema) => schema.required(),
              }),
          })
        )
        .min(1, "At least one question is required"),
    });

    try {
      await validationSchema.validate(this.surveyFormValues, { abortEarly: false });
      runInAction(() => {
        this.errors = {};
      });
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        runInAction(() => {
          this.errors = errors;
        });
      }
      return false;
    }
  }

  // Submit the survey
  async submitSurvey() {
    if (!authStore.user) {
      Toast.show({ type: "error", text1: "Error", text2: "You must be logged in to submit a survey." });
      return;
    }

    const isValid = await this.validateForm();
    if (!isValid) {
      Toast.show({ type: "error", text1: "Error", text2: "Please fix the errors in the form." });
      return;
    }

    this.loading = true;
    try {
      const response = await apiService.createSurvey({
        ...this.surveyFormValues,
        userId: authStore.user.id,
      });
      Toast.show({ type: "success", text1: "Success", text2: "Survey submitted successfully!" });
      runInAction(() => {
        this.surveyFormValues = {
          surveyTitle: "",
          questions: [{ question: "", type: "text", options: [] }],
        };
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to submit survey." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const surveyFormStore = new SurveyFormStore();