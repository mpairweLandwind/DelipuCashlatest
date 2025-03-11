import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/MobxContext';
import { CircularProgress } from 'react-native-circular-progress';
import Checkbox from 'expo-checkbox';

const QuestionAnswerScreen = observer(() => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const { questionStore, authStore } = useStores();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const fetchData = async () => {
      await questionStore.fetchUploadedQuestions();
      const userId = authStore.user?.id;
      if (userId) {
        const user = await questionStore.getUserPoints(userId);
        setPoints(user.points || 0);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      Alert.alert('Time’s Up!', 'You’ve run out of time. Better luck next time!');
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = async (answer: string | string[]) => {
    const currentQuestion = questionStore.uploadedQuestions[currentQuestionIndex];
    let isAnswerCorrect = false;

    if (currentQuestion.type === 'radio' || currentQuestion.type === 'multi-choice') {
      isAnswerCorrect = answer === currentQuestion.correctAnswers[0];
    } else if (currentQuestion.type === 'check' || currentQuestion.type === 'dropdown') {
      isAnswerCorrect =
        Array.isArray(answer) &&
        answer.length === currentQuestion.correctAnswers.length &&
        answer.every((ans) => currentQuestion.correctAnswers.includes(ans));
    } else if (currentQuestion.type === 'boolean' || currentQuestion.type === 'input') {
      // Case-insensitive comparison for boolean and input
      isAnswerCorrect =
        typeof answer === 'string' &&
        currentQuestion.correctAnswers.some(
          (correctAnswer: string) => correctAnswer.toLowerCase() === answer.toLowerCase()
        );
    }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setPoints((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextOrFinish = () => {
    // Show feedback
    if (isCorrect) {
      Alert.alert('Correct!', 'Great job 🎉');
    } else {
      Alert.alert('Incorrect', 'Better luck next time! 😢');
    }

    // Reset for the next question
    setSelectedAnswer('');
    setSelectedAnswers([]);
    setIsCorrect(null);

    if (currentQuestionIndex < questionStore.uploadedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowSessionSummary(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  };

  const updatePointsInDatabase = async () => {
    try {
      const userId = authStore.user?.id;
      if (!userId) throw new Error('User not logged in');
      await questionStore.updateUserPoints(userId, points);
    } catch (error) {
      console.error('Failed to update points:', error);
    }
  };

  const closeSessionSummary = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowSessionSummary(false);
      updatePointsInDatabase();

      // Add a delay before navigating to the home screen
      setTimeout(() => {
        router.push('/(tabs)');
      }, 1000);
    });
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>You must be logged in to attempt questions.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (questionStore.loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.headerText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  if (questionStore.uploadedQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.headerText}>No questions available.</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questionStore.uploadedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionStore.uploadedQuestions.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <CircularProgress
            size={100}
            width={10}
            fill={(timeLeft / (25 * 60)) * 100}
            tintColor="#01796F"
            backgroundColor="#EEE"
          >
            {() => <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>}
          </CircularProgress>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Active Question</Text>
          <Ionicons name="trophy" size={32} color="#4CAF50" />
        </View>

        {/* Streak Display */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 Streak: {streak}</Text>
          <Text style={styles.pointsText}>⭐ Points: {points}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        {/* Options or Input Field */}
        {currentQuestion.type === 'radio' || currentQuestion.type === 'multi-choice' ? (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setSelectedAnswer(option);
                  handleAnswer(option);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : currentQuestion.type === 'check' || currentQuestion.type === 'dropdown' ? (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option: string, index: number) => (
              <View key={index} style={styles.checkboxContainer}>
                <Checkbox
                  value={selectedAnswers.includes(option)}
                  onValueChange={() => {
                    const updatedAnswers = selectedAnswers.includes(option)
                      ? selectedAnswers.filter((ans) => ans !== option)
                      : [...selectedAnswers, option];
                    setSelectedAnswers(updatedAnswers);
                    handleAnswer(updatedAnswers);
                  }}
                  color={selectedAnswers.includes(option) ? '#01796F' : undefined}
                />
                <Text style={styles.optionText}>{option}</Text>
              </View>
            ))}
          </View>
        ) : currentQuestion.type === 'boolean' ? (
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={styles.booleanButton}
              onPress={() => {
                setSelectedAnswer('true');
                handleAnswer('true');
              }}
            >
              <Text style={styles.booleanText}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.booleanButton}
              onPress={() => {
                setSelectedAnswer('false');
                handleAnswer('false');
              }}
            >
              <Text style={styles.booleanText}>False</Text>
            </TouchableOpacity>
          </View>
        ) : currentQuestion.type === 'input' ? (
          <TextInput
            style={styles.input}
            placeholder={currentQuestion.placeholder || 'Enter your answer'}
            value={selectedAnswer}
            onChangeText={setSelectedAnswer}
            onSubmitEditing={() => handleAnswer(selectedAnswer)}
          />
        ) : null}

        {/* Next or Finish Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextOrFinish}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'Finish Session' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Session Summary Popup */}
      <Modal transparent visible={showSessionSummary} animationType="fade">
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Session Summary</Text>
            <Text style={styles.modalText}>You earned {points} points!</Text>
            <Text style={styles.modalText}>🔥 Streak: {streak}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeSessionSummary}>
              <Text style={styles.modalButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContainer: { paddingHorizontal: '5%', paddingVertical: '5%' },
  timerContainer: { alignItems: 'center', marginVertical: 20 },
  timerText: { fontSize: 20, fontWeight: 'bold', color: '#01796F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#01796F' },
  streakContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  streakText: { fontSize: 16, color: '#FF4500' },
  pointsText: { fontSize: 16, color: '#FFD700' },
  questionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    borderWidth: 4,
    borderColor: '#01796F',
  },
  questionText: { fontSize: 20, fontWeight: '600', color: '#333' },
  optionsContainer: { marginVertical: 10 },
  optionButton: {
    backgroundColor: '#EEE',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: { fontSize: 16, color: '#333' },
  nextButton: {
    backgroundColor: '#01796F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 15,
  },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#F44336', marginBottom: 20 },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '50%',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01796F',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#01796F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  booleanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  booleanButton: {
    backgroundColor: '#EEE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
  },
  booleanText: {
    fontSize: 16,
    color: '#333',
  },
});

export default QuestionAnswerScreen;
