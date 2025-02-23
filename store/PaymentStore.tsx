import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import Toast from "react-native-toast-message";
import { authStore } from "./AuthStore";
import { sub } from "date-fns";

export interface Payment {
  id: string;
  amount: number;
  phoneNumber: string;
  provider: 'MTN' | 'AIRTEL';
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  userId: string;
  subscriptionType: 'WEEKLY' | 'MONTHLY';
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

class PaymentStore {
  payments: Payment[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all payments for the logged-in user
  async fetchPayments() {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error('You must be logged in to fetch payments.');
    }

    this.loading = true;
    try {
      const payments = await apiService.getAllPayments();
      runInAction(() => {
        this.payments = payments.filter((payment: Payment) => payment.userId === userId);
      });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch payments.' });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Initiate a payment and update subscription status upon success
  async initiatePayment(
    amount: number,
    phoneNumber: string,
    provider: 'MTN' | 'AIRTEL',
    subscriptionType: 'WEEKLY' | 'MONTHLY'
  ) {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error('You must be logged in to initiate a payment.');
    }

    if (!amount || !phoneNumber || !provider || !subscriptionType) {
      throw new Error('Please fill all fields.');
    }

    this.loading = true;
    try {
      const response = await apiService.handlePayment(
        amount,
        phoneNumber,
        provider,
        subscriptionType,
        userId
      );

      // Update the subscription status to 'active' upon successful payment
      if (response.status === 'SUCCESS') {
        await authStore.updateSubscriptionStatus(); 
      }

      

      Toast.show({ type: 'success', text1: 'Success', text2: 'Payment completed successfully!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to initiate payment.' });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const paymentStore = new PaymentStore();
