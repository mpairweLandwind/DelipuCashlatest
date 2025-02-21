import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import Toast from "react-native-toast-message";
import { authStore } from "./AuthStore";

export interface Payment {
  id: string;
  amount: number;
  phoneNumber: string;
  provider: 'MTN' | 'AIRTEL';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  userId: string;
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
      throw new Error("You must be logged in to fetch payments.");
    }

    this.loading = true;
    try {
      const payments = await apiService.getAllPayments();
      runInAction(() => {
        this.payments = payments.filter((payment: Payment) => payment.userId === userId);
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to fetch payments." });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updatePaymentStatus(paymentId: string, status: 'PENDING' | 'SUCCESS' | 'FAILED') {
    this.loading = true;
    try {
      await apiService.updatePaymentStatus(paymentId, status);
      runInAction(() => {
        const payment = this.payments.find(p => p.id === paymentId);
        if (payment) {
          payment.status = status;
        }
      });
      Toast.show({ type: "success", text1: "Success", text2: "Payment status updated successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to update payment status." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchPaymentHistory() {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to fetch payment history.");
    }

    this.loading = true;
    try {
      const paymentHistory = await apiService.getPaymentHistory(userId);
      runInAction(() => {
        this.payments = paymentHistory;
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to fetch payment history." });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Initiate a payment and update subscription status upon success
  async initiatePayment(amount: number, phoneNumber: string, provider: 'MTN' | 'AIRTEL') {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to initiate a payment.");
    }

    if (!amount || !phoneNumber || !provider) {
      throw new Error("Please fill all fields.");
    }

    this.loading = true;
    try {
      const response = await apiService.handlePayment(amount, phoneNumber, provider);

      // Update the subscription status to 'active' upon successful payment
      await authStore.updateSubscriptionStatus('active');

      runInAction(() => {
        // Add the new payment to the top of the list
        this.payments.unshift({
          id: response.id, // Assuming the response contains the payment ID
          amount,
          phoneNumber,
          provider,
          status: 'SUCCESS', // Update status to SUCCESS
          userId,
        });
      });

      Toast.show({ type: "success", text1: "Success", text2: "Payment completed successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to initiate payment." });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const paymentStore = new PaymentStore();
