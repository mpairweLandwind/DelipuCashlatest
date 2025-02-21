import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStores } from '@/store/MobxContext';
import PaymentScreen from '@/components/PaymentScreen';
import * as DocumentPicker from 'expo-document-picker';
import { authStore } from '@/store/AuthStore';

const QuestionScreen = () => {
  const router = useRouter();
  const { questionStore } = useStores();
  const [question, setQuestion] = useState('');
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  // Check if the user has an active subscription
  const hasActiveSubscription = authStore.user?.subscriptionStatus === 'active';

  // Fetch questions on component mount
  useEffect(() => {
    questionStore.fetchQuestions().catch(error => {
      console.error('Error fetching questions:', error);
    });
  }, []);

  // Handle payment completion
  const handlePaymentCompletion = async () => {
    try {
      // Update the user's subscription status to active
      await authStore.updateSubscriptionStatus('active');
      setShowPaymentScreen(false);
      Alert.alert('Success', 'Payment completed! You can now submit your question or answer questions.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update subscription status. Please try again.');
    }
  };

  // Handle question submission
  const handleSubmitQuestion = async () => {
    if (!hasActiveSubscription) {
      Alert.alert('Payment Required', 'Please complete the payment to submit your question.');
      setShowPaymentScreen(true); // Show payment screen if subscription is inactive
      return;
    }

    if (question.trim() === '') {
      Alert.alert('Error', 'Please enter a valid question.');
      return;
    }

    try {
      await questionStore.submitQuestion(question);
      setQuestion('');
      Alert.alert('Success', 'Your question has been submitted.');
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to submit question.');
    }
  };

  // Handle answering questions
  const handleAnswerQuestion = (questionId: string, questionText: string) => {
    if (!hasActiveSubscription) {
      Alert.alert('Payment Required', 'Please complete the payment to answer questions.');
      setShowPaymentScreen(true); // Show payment screen if subscription is inactive
      return;
    }

    router.push({
      pathname: '/commentScreen',
      params: { questionId, questionText },
    });
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!authStore.user) {
      Alert.alert('Error', 'You must be logged in to upload a rewards file.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled) {
        Alert.alert('Info', 'File selection canceled.');
        return;
      }

      const file = result.assets[0];
      const fileContent = await readFileContent(file);
      const parsedQuestions = JSON.parse(fileContent);

      if (!Array.isArray(parsedQuestions)) {
        throw new Error('Invalid file format: Expected an array of questions.');
      }

      const formattedQuestions = parsedQuestions.map((q: any, index: number) => {
        if (!q.text || !q.type) {
          throw new Error(`Invalid format in question ${index + 1}: Missing 'text' or 'type'.`);
        }

        const baseQuestion = {
          text: q.text,
          type: q.type,
          userId: authStore.user?.id || '',
          createdAt: new Date().toISOString(),
        };

        switch (q.type) {
          case 'text':
            return baseQuestion;
          case 'radio':
          case 'check':
          case 'multi-choice':
          case 'dropdown':
            if (!Array.isArray(q.options) || q.options.length === 0) {
              throw new Error(`Invalid options for ${q.type} in question ${index + 1}.`);
            }
            return {
              ...baseQuestion,
              options: q.options,
              correctAnswers: q.correctAnswers || [],
            };
          case 'input':
            return {
              ...baseQuestion,
              placeholder: q.placeholder || '',
            };
          case 'rating':
            if (typeof q.minValue !== 'number' || typeof q.maxValue !== 'number') {
              throw new Error(`Invalid rating values in question ${index + 1}.`);
            }
            return {
              ...baseQuestion,
              minValue: q.minValue,
              maxValue: q.maxValue,
            };
          case 'boolean':
            return baseQuestion;
          default:
            throw new Error(`Unsupported question type: ${q.type} in question ${index + 1}.`);
        }
      });

      await questionStore.uploadQuestions(formattedQuestions);
      Alert.alert('Success', 'Questions uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to upload file.');
    }
  };

  // Helper function to read file content
  const readFileContent = async (file: any) => {
    const response = await fetch(file.uri);
    return await response.text();
  };

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

        {/* Main Content */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Ask Your Question</Text>
            <Ionicons name="help-circle" size={32} color="#0FC2C0" />
          </View>
          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={24} color="#FFD700" />
            <Text style={styles.tipText}>Keep your question clear and concise for better answers!</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your question here..."
              placeholderTextColor="#BBB"
              value={question}
              onChangeText={setQuestion}
              multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuestion}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeader}>Recent Questions</Text>
          {questionStore.questions.map((q) => (
            <View key={q.id} style={styles.questionCard}>
              <Text style={styles.questionText}>{q.text}</Text>
              <Text style={styles.timestamp}>{q.createdAt}</Text>
              <TouchableOpacity
                style={styles.answerButton}
                onPress={() => handleAnswerQuestion(q.id, q.text)}
              >
                <Text style={styles.answerButtonText}>Answer Question</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Reward Card */}
        <View style={styles.rewardCard}>
          <Text style={styles.rewardText}>Answer Questions and Earn Rewards!</Text>
          <Ionicons name="gift" size={40} color="#FFD700" style={styles.giftIcon} />
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowPaymentScreen(true)}
          >
            <Text style={styles.startButtonText}>Pay to Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleFileUpload}
          >
            <Text style={styles.startButtonText}>Upload Questions For Rewards</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0FC2C0',
    borderRadius: 20,
    padding: 8,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerText: { fontSize: 30, fontWeight: 'bold', color: '#0FC2C0' },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tipText: { color: '#FFD700', marginLeft: 8, fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
    marginBottom: 10,
    minHeight: 100,
  },
  submitButton: { backgroundColor: '#0FC2C0', padding: 12, borderRadius: 8, marginLeft: 10 },
  submitButtonText: { color: '#FFF', fontWeight: 'bold' },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#EAEAEA', marginBottom: 12 },
  questionCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionText: { fontSize: 16, color: '#EAEAEA' },
  answerButton: { backgroundColor: '#0FC2C0', padding: 10, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  timestamp: { fontSize: 12, color: '#BBB', marginTop: 4 },
  answerButtonText: { color: '#FFF', fontWeight: 'bold' },
  rewardCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1.5 },
  },
  giftIcon: { marginBottom: 10 },
  rewardText: { fontSize: 20, fontWeight: 'bold', color: '#0FC2C0', textAlign: 'center', marginBottom: 10 },
  startButton: { backgroundColor: '#0FC2C0', padding: 12, borderRadius: 8, alignItems: 'center', width: '80%', marginBottom: 20 },
  startButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default QuestionScreen;
