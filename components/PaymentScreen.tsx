import React, { useState ,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '@/store/MobxContext';
import { observer } from 'mobx-react-lite';

interface PaymentScreenProps {
  onPaymentComplete: () => void;
}
const PaymentScreen: React.FC<PaymentScreenProps> = observer(({ onPaymentComplete }) => {
  const { paymentStore, authStore } = useStores(); // Using useStore correctly

  // Get default phone number from authenticated user
  const userPhoneNumber = authStore.user?.phone || '';

  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
  const [selectedProvider, setSelectedProvider] = useState<'MTN' | 'AIRTEL' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'WEEKLY' | 'MONTHLY' | null>(null);

  // Check if the user has an active subscription
  const hasActiveSubscription = authStore.user?.subscriptionStatus === 'ACTIVE';

  // Update phone number when authStore user changes
  useEffect(() => {
    setPhoneNumber(userPhoneNumber);
  }, [userPhoneNumber]);

  // Handle payment submission
  const handlePay = async () => {
    if (!phoneNumber || !selectedProvider || !selectedPlan) {
      Alert.alert('Error', 'Please fill in all fields and select a payment provider and plan.');
      return;
    }

    const amount = selectedPlan === 'WEEKLY' ? 1000 : 2000; // Set amount based on the selected plan
     const paymentPlan = selectedPlan === 'WEEKLY' ? 'WEEKLY' : 'MONTHLY'; // Set payment plan based on the selected plan
    try {
      // Use paymentStore to initiate the payment
      await paymentStore.initiatePayment(amount, phoneNumber, selectedProvider, paymentPlan);
      Alert.alert('Success', 'Payment completed successfully!');
      onPaymentComplete(); // Notify parent component
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Subscription Status */}
      {hasActiveSubscription && (
        <View style={styles.subscriptionStatus}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.subscriptionStatusText}>You have an active subscription!</Text>
        </View>
      )}

      {/* Subscription Plans */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choose Subscription Plan</Text>
        <View style={styles.planContainer}>
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan === 'WEEKLY' && styles.selectedPlanButton,
            ]}
            onPress={() => setSelectedPlan('WEEKLY')}
          >
            <Text style={styles.planText}>Weekly</Text>
            <Text style={styles.planPrice}>1000 UGX</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan === 'MONTHLY' && styles.selectedPlanButton,
            ]}
            onPress={() => setSelectedPlan('MONTHLY')}
          >
            <Text style={styles.planText}>Monthly</Text>
            <Text style={styles.planPrice}>2000 UGX</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Provider Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Payment Provider</Text>
        <View style={styles.providerContainer}>
          <TouchableOpacity
            style={[
              styles.providerButton,
              selectedProvider === 'MTN' && styles.selectedProviderButton,
            ]}
            onPress={() => setSelectedProvider('MTN')}
          >
            <Image source={require('@/assets/images/mtnlogo.png')} style={styles.providerLogo} />
            <Text style={styles.providerText}>MTN Mobile Money</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.providerButton,
              selectedProvider === 'AIRTEL' && styles.selectedProviderButton,
            ]}
            onPress={() => setSelectedProvider('AIRTEL')}
          >
            <Image source={require('@/assets/images/airtellogo.png')} style={styles.providerLogo} />
            <Text style={styles.providerText}>Airtel Money</Text>
          </TouchableOpacity>
        </View>
      </View>
{/* Phone Number Input */}
<View style={styles.card}>
        <Text style={styles.cardTitle}>Enter Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 256712345678"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber} // Allows editing
        />
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  subscriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  subscriptionStatusText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    marginHorizontal: 5,
    backgroundColor: '#FAFAFA',
  },
  selectedPlanButton: {
    borderColor: '#0FC2C0',
    backgroundColor: '#E6F9F8',
  },
  planText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  planPrice: {
    fontSize: 14,
    color: '#666',
  },
  providerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    marginHorizontal: 5,
    backgroundColor: '#FAFAFA',
  },
  selectedProviderButton: {
    borderColor: '#0FC2C0',
    backgroundColor: '#E6F9F8',
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  providerText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#0FC2C0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default PaymentScreen;
