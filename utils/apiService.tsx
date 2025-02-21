// import { useQuery, useMutation } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import axios, { AxiosError, AxiosRequestConfig } from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// declare module "axios" {
//     export interface AxiosRequestConfig {
//       skipAuth?: boolean; // Custom property to skip adding Authorization header
//     }
//   }
  
//   // Base Axios instance
//   const api = axios.create({
//     baseURL: "http://10.10.168.249:3000/api", // Adjust base URL as needed
//     timeout: 15000,
//     withCredentials: true, // Include cookies in requests
//   });
  
//   // Interceptor for adding tokens to requests (conditionally)
//   api.interceptors.request.use(async (config) => {
//     if (config.skipAuth) return config; // Skip adding Authorization header if skipAuth is true
  
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });
  
//   // Centralized error handler using Toast
//   const handleError = (error: AxiosError, customMessage?: string) => {
//     const errorMessage =
//       (error.response?.data as any)?.message || // Safely access error message
//       customMessage ||
//       error.message ||
//       "An error occurred";
  
//     Toast.show({
//       type: "error",
//       text1: "Error",
//       text2: errorMessage,
//     });
  
//     throw error; // Re-throw the error for further handling if needed
//   };
// // Auth APIs
// const signInUser = async (credentials: { email: string; password: string }) => {
//   const response = await api.post(
//     "/auth/signin",
//     { email: credentials.email, password: credentials.password },
//     { skipAuth: true } // Skip token for sign-in
//   );
//   const { token } = response.data;
//   if (token) {
//     await AsyncStorage.setItem("token", token);
//     Toast.show({ type: "success", text1: "Success", text2: "Signed in successfully!" });
//   }
//   return response.data;
// };

// const signUpUser = async (userData: {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
// }) => {
//   const response = await api.post(
//     "/auth/signup",
//     { ...userData },
//     { skipAuth: true } // Skip token for sign-up
//   );
//   Toast.show({ type: "success", text1: "Success", text2: "Signed up successfully!" });
//   return response.data;
// };

// const logout = async () => {
//   await api.post("/auth/signout");
//   await AsyncStorage.clear();
//   Toast.show({ type: "success", text1: "Success", text2: "Logged out successfully!" });
// };

// // Survey APIs
// const getAllSurveys = async () => {
//   const response = await api.get("/surveys");
//   return response.data;
// };

// const getSurveyById = async (surveyId: string) => {
//   const response = await api.get(`/surveys/${surveyId}`);
//   return response.data;
// };

// const createSurvey = async (data: any) => {
//   const response = await api.post("/surveys", data);
//   Toast.show({ type: "success", text1: "Success", text2: "Survey created successfully!" });
//   return response.data;
// };

// const updateSurvey = async (surveyId: string, data: any) => {
//   const response = await api.put(`/surveys/${surveyId}`, data);
//   Toast.show({ type: "success", text1: "Success", text2: "Survey updated successfully!" });
//   return response.data;
// };

// const deleteSurvey = async (surveyId: string) => {
//   const response = await api.delete(`/surveys/${surveyId}`);
//   Toast.show({ type: "success", text1: "Success", text2: "Survey deleted successfully!" });
//   return response.data;
// };

// const submitSurveyResponse = async (surveyId: string, responses: any) => {
//   const response = await api.post(`/surveys/${surveyId}/responses`, { responses });
//   Toast.show({ type: "success", text1: "Success", text2: "Survey response submitted successfully!" });
//   return response.data;
// };

// const getSurveyResponses = async (surveyId: string) => {
//   const response = await api.get(`/surveys/${surveyId}/responses`);
//   return response.data;
// };

// // Video APIs
// const getAllVideos = async () => {
//   const response = await api.get("/videos", { skipAuth: true }); // Skip token
//   return response.data;
// };

// const likeVideo = async (videoId: string) => {
//   const response = await api.post(`/videos/${videoId}/like`);
//   return response.data;
// };

// const addComment = async (videoId: string, text: string) => {
//   const response = await api.post(`/videos/${videoId}/comments`, { text });
//   return response.data;
// };

// const bookmarkVideo = async (videoId: string) => {
//   const response = await api.post(`/videos/${videoId}/bookmark`);
//   return response.data;
// };

// const uploadVideo = async (file: any, title: string, userId: string) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("title", title);
//   formData.append("userId", userId);

//   const response = await api.post("/videos/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // Reward APIs
// const getRewards = async () => {
//   const response = await api.get("/rewards");
//   return response.data;
// };

// const claimReward = async (rewardId: string) => {
//   const response = await api.post(`/rewards/${rewardId}/claim`);
//   Toast.show({ type: "success", text1: "Success", text2: "Reward claimed successfully!" });
//   return response.data;
// };

// // Question APIs
// const submitQuestion = async (questionText: string, userId: string) => {
//   const response = await api.post("/questions", { text: questionText, userId });
//   Toast.show({ type: "success", text1: "Success", text2: "Question submitted successfully!" });
//   return response.data;
// };

// const getQuestions = async () => {
//   const response = await api.get("/questions");
//   return response.data;
// };

// const getQuestionById = async (questionId: string) => {
//   const response = await api.get(`/questions/${questionId}`);
//   return response.data;
// };

// const submitResponse = async (questionId: string, responseText: string, userId: string) => {
//   const response = await api.post(`/questions/${questionId}/responses`, { text: responseText, userId });
//   Toast.show({ type: "success", text1: "Success", text2: "Response submitted successfully!" });
//   return response.data;
// };

// const getResponsesForQuestion = async (questionId: string) => {
//   const response = await api.get(`/questions/${questionId}/responses`);
//   return response.data;
// };

// // Payment API
// const handlePayment = async (paymentData: {
//   amount: number;
//   phoneNumber: string;
//   provider: "MTN" | "AIRTEL";
// }) => {
//   const response = await api.post("/payments/initiate", paymentData);
//   Toast.show({ type: "success", text1: "Success", text2: "Payment initiated successfully!" });
//   return response.data;
// };

// // Export TanStack Query hooks
// export const useSignInUser = () =>
//   useMutation(signInUser, {
//     onError: (error: Error) => handleError(error, "Failed to sign in."),
//   });

// export const useSignUpUser = () =>
//   useMutation(signUpUser, {
//     onError: (error: Error) => handleError(error, "Failed to sign up."),
//   });

// export const useLogout = () =>
//   useMutation(logout, {
//     onError: (error: Error) => handleError(error, "Failed to log out."),
//   });

// export const useGetAllSurveys = () =>
//   useQuery({
//     queryKey: ["surveys"], // Unique key for caching
//     queryFn: getAllSurveys,
//     onError: (error: Error) => handleError(error, "Failed to fetch surveys."),
//   });

// export const useGetSurveyById = (surveyId: string) =>
//   useQuery({
//     queryKey: ["survey", surveyId], // Unique key for caching
//     queryFn: () => getSurveyById(surveyId),
//     onError: (error: Error) => handleError(error, "Failed to fetch survey details."),
//   });

// export const useCreateSurvey = () =>
//   useMutation(createSurvey, {
//     onError: (error: Error) => handleError(error, "Failed to create survey."),
//   });

// export const useUpdateSurvey = () =>
//   useMutation(updateSurvey, {
//     onError: (error: Error) => handleError(error, "Failed to update survey."),
//   });

// export const useDeleteSurvey = () =>
//   useMutation(deleteSurvey, {
//     onError: (error: Error) => handleError(error, "Failed to delete survey."),
//   });

// export const useSubmitSurveyResponse = () =>
//   useMutation(submitSurveyResponse, {
//     onError: (error: Error) => handleError(error, "Failed to submit survey response."),
//   });

// export const useGetSurveyResponses = (surveyId: string) =>
//   useQuery({
//     queryKey: ["surveyResponses", surveyId], // Unique key for caching
//     queryFn: () => getSurveyResponses(surveyId),
//     onError: (error: Error) => handleError(error, "Failed to fetch survey responses."),
//   });

// export const useGetAllVideos = () =>
//   useQuery({
//     queryKey: ["videos"], // Unique key for caching
//     queryFn: getAllVideos,
//     onError: (error: Error) => handleError(error, "Failed to fetch videos."),
//   });

// export const useLikeVideo = () =>
//   useMutation(likeVideo, {
//     onError: (error: Error) => handleError(error, "Failed to like video."),
//   });

// export const useAddComment = () =>
//   useMutation(addComment, {
//     onError: (error: Error) => handleError(error, "Failed to add comment."),
//   });

// export const useBookmarkVideo = () =>
//   useMutation(bookmarkVideo, {
//     onError: (error: Error) => handleError(error, "Failed to bookmark video."),
//   });

// export const useUploadVideo = () =>
//   useMutation(uploadVideo, {
//     onError: (error: Error) => handleError(error, "Failed to upload video."),
//   });

// export const useGetRewards = () =>
//   useQuery({
//     queryKey: ["rewards"], // Unique key for caching
//     queryFn: getRewards,
//     onError: (error: Error) => handleError(error, "Failed to fetch rewards."),
//   });

// export const useClaimReward = () =>
//   useMutation(claimReward, {
//     onError: (error: Error) => handleError(error, "Failed to claim reward."),
//   });

// export const useSubmitQuestion = () =>
//   useMutation(submitQuestion, {
//     onError: (error: Error) => handleError(error, "Failed to submit question."),
//   });

// export const useGetQuestions = () =>
//   useQuery({
//     queryKey: ["questions"], // Unique key for caching
//     queryFn: getQuestions,
//     onError: (error: Error) => handleError(error, "Failed to fetch questions."),
//   });

// export const useGetQuestionById = (questionId: string) =>
//   useQuery({
//     queryKey: ["question", questionId], // Unique key for caching
//     queryFn: () => getQuestionById(questionId),
//     onError: (error: Error) => handleError(error, "Failed to fetch question details."),
//   });

// export const useSubmitResponse = () =>
//   useMutation(submitResponse, {
//     onError: (error: Error) => handleError(error, "Failed to submit response."),
//   });

// export const useGetResponsesForQuestion = (questionId: string) =>
//   useQuery({
//     queryKey: ["responses", questionId], // Unique key for caching
//     queryFn: () => getResponsesForQuestion(questionId),
//     onError: (error: Error) => handleError(error, "Failed to fetch responses."),
//   });

// export const useHandlePayment = () =>
//   useMutation(handlePayment, {
//     onError: (error: Error) => handleError(error, "Failed to process payment."),
//   });
