import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// Extend AxiosRequestConfig to include skipAuth
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean; // Custom property to skip adding Authorization header
  }
}

// Base Axios instance
const api = axios.create({
  baseURL: "http://10.150.13.215:3000/api"
  , // Adjust base URL as needed
  timeout: 15000,
  withCredentials: true, // Include cookies in requests
});

// Interceptor for adding tokens to requests (conditionally)
api.interceptors.request.use(async (config) => {
  if (config.skipAuth) return config; // Skip adding Authorization header if skipAuth is true

  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handler using Toast
const handleError = (error: AxiosError, customMessage?: string) => {
  const errorMessage =
    (error.response?.data as any)?.message || // Safely access error message
    customMessage ||
    error.message ||
    "An error occurred";

  Toast.show({
    type: "error",
    text1: "Error",
    text2: errorMessage,
  });

  throw error; // Re-throw the error for further handling if needed
};

// API Services
export const apiService = {
  // Auth APIs
  async signInUser(email: string, password: string) {
    try {
      const response = await api.post(
        "/auth/signin",
        { email, password },
        { skipAuth: true } // Skip token for sign-in
      );
      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem("token", token);
        Toast.show({ type: "success", text1: "Success", text2: "Signed in successfully!" });
      }
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to sign in. Check your credentials.");
    }
  },

  async signUpUser(email: string, password: string, firstName: string, lastName: string, phone: string) {
    try {
      const response = await api.post(
        "/auth/signup",
        { email, password, firstName, lastName , phone},
        { skipAuth: true } // Skip token for sign-up
      );
      Toast.show({ type: "success", text1: "Success", text2: "Signed up successfully!" });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to sign up.");
    }
  },

  async logout() {
    try {
      await api.post("/auth/signout");
      await AsyncStorage.clear();
      Toast.show({ type: "success", text1: "Success", text2: "Logged out successfully!" });
    } catch (error) {
      handleError(error as AxiosError, "Failed to log out.");
    }
  },

  async updateSubscriptionStatus(userId: string) {
    try {
      const response = await api.put(`/auth/${userId}/subscription-status`);
  
      // Show success message
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Subscription updated !`,
      });
  
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to update subscription status.");
    }
  },


  async checkSubscriptionStatus(userId: string): Promise<{ subscriptionStatus: "ACTIVE" | "INACTIVE" }> {
    try {
      const response = await api.get(`/auth/${userId}/subscription-status`);
  
      // Show success message
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Subscription status is ${response.data.subscriptionStatus}!`,
      });
  
      return { subscriptionStatus: response.data.subscriptionStatus };
    } catch (error) {
      handleError(error as AxiosError, "Failed to check subscription status.");
      throw error; // Re-throw the error for the caller to handle
    }
  },


  async getPaymentHistory(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/payments`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to fetch payment history.");
    }
  },
  
  async updatePaymentStatus(paymentId: string, status: "PENDING" | "SUCCESS" | "FAILED") {
    try {
      const response = await api.put(`/payments/${paymentId}/status`, { status });
  
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Payment status updated to ${status}!`,
      });
  
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to update payment status.");
    }
  },
  
  // update user
  async updateUser(details: any) {
    try {
      const response = await api.put("/users", details);
      Toast.show({ type: "success", text1: "Success", text2: "User updated successfully!" });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to update user.");
    }
  },
// Survey APIs
async getAllSurveys() {
  try {
    const response = await api.get("/surveys");
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to fetch surveys.");
  }
},

async getSurveyById(surveyId: string) {
  try {
    const response = await api.get(`/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to fetch survey details.");
  }
},

async createSurvey(data: any) {
  try {
    const response = await api.post("/surveys", data);
    Toast.show({ type: "success", text1: "Success", text2: "Survey created successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to create survey.");
  }
},

async updateSurvey(surveyId: string, data: any) {
  try {
    const response = await api.put(`/surveys/${surveyId}`, data);
    Toast.show({ type: "success", text1: "Success", text2: "Survey updated successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to update survey.");
  }
},

async deleteSurvey(surveyId: string) {
  try {
    const response = await api.delete(`/surveys/${surveyId}`);
    Toast.show({ type: "success", text1: "Success", text2: "Survey deleted successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to delete survey.");
  }
},

async submitSurveyResponse(surveyId: string, responses: any) {
  try {
    const response = await api.post(`/surveys/${surveyId}/responses`, { responses });
    Toast.show({ type: "success", text1: "Success", text2: "Survey response submitted successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to submit survey response.");
  }
},

async getSurveyResponses(surveyId: string) {
  try {
    const response = await api.get(`/surveys/${surveyId}/responses`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to fetch survey responses.");
  }
},

// File Upload APIs
async uploadSurveyFile(file: any) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/surveys/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    Toast.show({ type: "success", text1: "Success", text2: "File uploaded successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to upload file.");
  }
},


  // Video APIs (Public endpoint)
  async getAllVideos() {
    try {
      const response = await api.get("/videos", { skipAuth: true }); // Skip token
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to fetch videos.");
    }
  },

async likeVideo(videoId: string) {
  try {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to like video.");
  }
},


async addComment(videoId: string, text: string) {
  try {
    const response = await api.post(`/videos/${videoId}/comments`, { text });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to add comment.");
  }
},

async bookmarkVideo(videoId: string) {
  try {
    const response = await api.post(`/videos/${videoId}/bookmark`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to bookmark video.");
  }
},


async uploadVideo(file: any, title: string, userId: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("userId", userId);

    const response = await api.post("/videos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to upload video.");
  }
},


  // Reward APIs
  async getRewards() {
    try {
      const response = await api.get("/rewards");
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to fetch rewards.");
    }
  },

  async claimReward(rewardId: string) {
    try {
      const response = await api.post(`/rewards/${rewardId}/claim`);
      Toast.show({ type: "success", text1: "Success", text2: "Reward claimed successfully!" });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, "Failed to claim reward.");
    }
  },



// Question APIs
async submitQuestion(questionText: string, userId: string) {
  try {
    const response = await api.post("/questions/create", { text: questionText, userId });
    Toast.show({ type: "success", text1: "Success", text2: "Question submitted successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to submit question.");
  }
},

async getQuestions() {
  try {
    const response = await api.get("/questions/all");
    console.log(response.data);
    return response.data;
   
  } catch (error) {
    handleError(error as AxiosError, "Failed to fetch questions.");
  }
},

async getQuestionById(questionId: string) {
  try {
    const response = await api.get(`/questions/${questionId}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to fetch question details.");
  }
},

// Comment/Answer APIs
async submitResponse(questionId: string, responseText: string, userId: string) {
  try {
    // Make the API call to submit the response
    const response = await api.post(`/questions/${questionId}/responses`, { 
      responseText, 
      userId 
    });
   
    // Show success toast notification
    Toast.show({ 
      type: "success", 
      text1: "Success", 
      text2: "Response submitted successfully!" 
    });

    // Return the response data with the questionId included
    return { 
      ...response.data, 
      questionId // Ensure questionId is included in the response
    };
  } catch (error) {
    // Handle errors gracefully
    handleError(error as AxiosError, "Failed to submit response.");
  }
},

async getResponsesForQuestion(questionId: string) {
  try {
    const response = await api.get(`/questions/${questionId}/responses`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to fetch responses.");
  }
},

async uploadQuestions(questions: any[], userId: string) {
  try {
    const response = await api.post("/questions/upload", { questions, userId });
    Toast.show({ type: "success", text1: "Success", text2: "Questions uploaded successfully!" });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, "Failed to upload questions.");
    throw error;
  }
},


// Handle payment function
async handlePayment(amount: number, phoneNumber: string, provider: 'MTN' | 'AIRTEL',subscriptionType:'WEEKLY'| 'MONTHLY',userId:string) {
  try {
    // Make a POST request to the backend payment endpoint
    const response = await api.post('/payments/initiate', {
      amount,
      phoneNumber,
      provider, // Pass the payment provider (MTN or AIRTEL)
      subscriptionType,
      userId
    });

    // Show success message
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Payment initiated successfully!',
    });

    return response.data;
  } catch (error) {
    // Handle errors
    handleError(error as AxiosError, 'Failed to process payment.');
  }
},

// Fetch all payments function
async getAllPayments() {
  try {
    // Make a GET request to fetch all payments
    const response = await api.get('/payments');

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    handleError(error as AxiosError, 'Failed to fetch payments.');
  }
},



};
export default apiService;
