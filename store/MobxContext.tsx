import React, { createContext, useContext } from "react";
import { apiStore } from "./apistore";
import { authStore } from "./AuthStore";
import { questionStore } from "./QuestionStore";
import { surveyStore } from "./SurveyStore";
import { videoStore } from "./VideoStore";
import { surveyFormStore } from "./SurveyFormStore";
import { notificationStore } from "./NotificationStore"; // Import the notification store
import { paymentStore } from "./PaymentStore";
const MobxContext = createContext({
  apiStore,
  authStore,
  questionStore,
  surveyStore,
  videoStore,
  notificationStore, // Add it to the context
  surveyFormStore,
  paymentStore,
});

export const useStores = () => useContext(MobxContext);

export const MobxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MobxContext.Provider value={{ apiStore,paymentStore, authStore, questionStore, surveyStore, videoStore, notificationStore,surveyFormStore }}>
    {children}
  </MobxContext.Provider>
);
