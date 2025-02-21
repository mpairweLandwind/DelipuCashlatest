import { makeAutoObservable } from "mobx";
import * as Notifications from "expo-notifications";

class NotificationStore {
  notifications: { id: string; title: string; body: string }[] = [];

  constructor() {
    makeAutoObservable(this);
    this.configureNotifications();
  }

  configureNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  };

  sendNotification = async (title: string, body: string) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
    this.notifications.push({ id: notificationId, title, body });
  };
}

export const notificationStore = new NotificationStore();
