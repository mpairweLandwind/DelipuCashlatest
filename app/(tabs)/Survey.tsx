import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useStores } from '@/store/MobxContext';
import SurveyForm from '@/components/SurveyForm';
import PaymentScreen from '@/components/PaymentScreen';

const SurveyScreen = () => {
  const router = useRouter();
  const { surveyStore, authStore, notificationStore } = useStores();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const hasActiveSubscription = authStore.user?.subscriptionStatus === 'active';

  const handlePaymentCompletion = async () => {
    try {
      await authStore.updateSubscriptionStatus('active');
      setShowPaymentScreen(false);
      Alert.alert('Success', 'Payment completed! You can now create or upload surveys.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update subscription status. Please try again.');
    }
  };

  const toggleSurveyForm = () => {
    Animated.timing(animation, {
      toValue: showSurveyForm ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setShowSurveyForm((prevState) => !prevState);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled) {
      surveyStore.setSelectedFile(result);
    } else {
      surveyStore.setSelectedFile(null);
    }
  };

  const handleSurveyUpload = async () => {
    if (!authStore.user) {
      Alert.alert('Error', 'You must be logged in to create a survey.');
      return;
    }

    if (!hasActiveSubscription) {
      Alert.alert('Payment Required', 'Please complete the payment to create or upload surveys.');
      setShowPaymentScreen(true);
      return;
    }

    try {
      await surveyStore.createSurvey(surveyTitle, surveyDescription, 'defaultPaymentOption');
      setSurveyTitle('');
      setSurveyDescription('');
      setShowSurveyForm(false);

      notificationStore.sendNotification(
        "Survey Created",
        "Your survey has been successfully uploaded!"
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create survey.';
      Alert.alert('Error', errorMessage);
    }
  };

  const formHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust based on your form height
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Payment Screen Modal */}
        <Modal
          visible={showPaymentScreen && !hasActiveSubscription}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPaymentScreen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <PaymentScreen onPaymentComplete={handlePaymentCompletion} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPaymentScreen(false)}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Your Survey</Text>
          <Ionicons name="clipboard" size={40} color="#4CAF50" />
        </View>

        {/* Create Survey Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Start Your Survey</Text>
          <Text style={styles.cardText}>
            📌 Tips for a great survey:
            {'\n'}✔ Keep questions clear and concise.
            {'\n'}✔ Use multiple-choice for faster responses.
            {'\n'}✔ Keep it under 5 minutes for higher completion rates.
          </Text>
          <TouchableOpacity style={styles.createSurveyButton} onPress={toggleSurveyForm}>
            <AntDesign name={showSurveyForm ? "minus" : "plus"} size={20} color="#fff" />
            <Text style={styles.createSurveyButtonText}>{showSurveyForm ? 'Hide Survey' : 'Create Survey'}</Text>
          </TouchableOpacity>
        </View>

        {/* Animated Survey Form */}
        <Animated.View style={[styles.formContainer, { height: formHeight }]}>
          {showSurveyForm && <SurveyForm />}
        </Animated.View>

        {/* Survey Upload Guidelines Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📘 How to Prepare Your Survey in JSON Format</Text>
          <Text style={styles.cardText}>
            ✅ Use key-value pairs for structured data.{"\n"}
            ✅ Ensure each question has a unique ID and type.{"\n"}
            ✅ Example format:
          </Text>
          <View style={styles.jsonExampleContainer}>
            <ScrollView style={styles.jsonScroll} showsVerticalScrollIndicator={true}>
              <Text style={styles.jsonExampleText}>
                {`{
  "title": "Customer Feedback Survey",
  "description": "Help us improve our services",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "How satisfied are you with our service?",
      "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
    },
    {
      "id": 2,
      "type": "checkbox",
      "question": "What features do you use most?",
      "options": ["Chat", "Notifications", "Profile Customization"]
    },
    {
      "id": 3,
      "type": "text",
      "question": "Any additional feedback?"
    },
    {
      "id": 4,
      "type": "radio",
      "question": "Would you recommend our service?",
      "options": ["Yes", "No"]
    }
  ]
}`}
              </Text>
            </ScrollView>
          </View>
        </View>

        {/* Survey Upload Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Your Survey</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter survey title"
            value={surveyTitle}
            onChangeText={setSurveyTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter survey description"
            multiline
            numberOfLines={4}
            value={surveyDescription}
            onChangeText={setSurveyDescription}
          />

          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.uploadButtonText}>
              {surveyStore.selectedFile ? 'File Selected' : 'Upload Survey'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSurveyUpload}>
            <Text style={styles.submitButtonText}>Submit Survey</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  scrollContainer: { paddingHorizontal: '5%', paddingVertical: '5%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  cardText: { fontSize: 14, color: '#666', lineHeight: 20 },
  createSurveyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 10,
  },
  createSurveyButtonText: { color: '#fff', fontSize: 16, marginLeft: 8, fontWeight: '600' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  uploadButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  submitButton: {
    backgroundColor: '#0070BA',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  jsonExampleContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    maxHeight: 200,
    overflow: 'hidden',
  },
  jsonScroll: { maxHeight: 200 },
  jsonExampleText: { fontFamily: 'monospace', fontSize: 12, color: '#333' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0FC2C0',
    borderRadius: 20,
    padding: 8,
  },
  formContainer: {
    overflow: 'hidden',
  },
});

export default SurveyScreen;
