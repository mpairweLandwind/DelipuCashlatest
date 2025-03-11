import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStores } from '@/store/MobxContext';

const CommentScreen = () => {
  const router = useRouter();
  const { questionId, questionText } = useLocalSearchParams();
  const { questionStore } = useStores();
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  // Ensure questionId is a string
  const resolvedQuestionId = Array.isArray(questionId) ? questionId[0] : questionId;

  // Fetch responses for the question
  useEffect(() => {
    if (resolvedQuestionId) {
      console.log('Fetching responses for question:', resolvedQuestionId);
      questionStore.fetchResponses(resolvedQuestionId);
    }
  }, [resolvedQuestionId]);

  const handleSubmitResponse = async () => {
    if (newResponse.trim() === '') {
      Alert.alert('Error', 'Please enter a valid response.');
      return;
    }

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Disable the submit button

    try {
      // Submit the response
      await questionStore.submitResponse(resolvedQuestionId, newResponse);
      setNewResponse(''); // Clear the input field

      // Show success message
      Alert.alert('Success', 'Your response has been submitted.');

      // Add a delay before refreshing responses
      setTimeout(async () => {
        await questionStore.fetchResponses(resolvedQuestionId); // Refresh responses
        setIsSubmitting(false); // Re-enable the submit button
      }, 1000); // 1-second delay
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to submit response.';
      Alert.alert('Error', errorMessage);
      setIsSubmitting(false); // Re-enable the submit button on error
    }
  };

  const question = questionStore.questions.find((q) => q.id === resolvedQuestionId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Question Details</Text>

        <View style={styles.card}>
          <Text style={styles.questionText}>{questionText}</Text>
        </View>

        <Text style={styles.subHeader}>Responses</Text>
        {question?.responses?.map((response) => (
          <View key={response.id} style={styles.responseCard}>
            <Text style={styles.responseText}>{response.responseText}</Text>
            <Text style={styles.userText}>
              By: {response.user?.firstName} {response.user?.lastName} {response.createdAt}
            </Text>
          </View>
        ))}

        <TextInput
          style={styles.input}
          placeholder="Write your answer..."
          placeholderTextColor="#BBB"
          value={newResponse}
          onChangeText={setNewResponse}
          multiline
        />
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]} // Disable button style
          onPress={handleSubmitResponse}
          disabled={isSubmitting} // Disable button during submission
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#0FC2C0', marginBottom: 10 },
  card: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 10, marginBottom: 16 },
  questionText: { fontSize: 18, color: '#EAEAEA' },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#EAEAEA', marginBottom: 12 },
  responseCard: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 10, marginBottom: 10 },
  responseText: { fontSize: 16, color: '#EAEAEA' },
  userText: { fontSize: 12, color: '#BBB', marginTop: 5 },
  input: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
    marginBottom: 10,
    minHeight: 100,
  },
  submitButton: { backgroundColor: '#0FC2C0', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#666', opacity: 0.7 }, // Style for disabled button
  backButton: { backgroundColor: '#444', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  backButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default CommentScreen;
