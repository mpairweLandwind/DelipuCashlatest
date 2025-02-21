import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const QuestionAnswerScreen = () => {
  const router = useRouter(); // Expo Router for navigation
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock user login state
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'What is 5 + 3?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
    },
    {
      id: 2,
      text: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      correctAnswer: 'Paris',
    },
    {
      id: 3,
      text: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
      correctAnswer: 'Mars',
    },
    {
      id: 4,
      text: 'What is the boiling point of water in Celsius?',
      options: ['90°C', '100°C', '110°C', '120°C'],
      correctAnswer: '100°C',
    },
    {
      id: 5,
      text: 'What is the square root of 64?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(3); // User's streak count
  const [points, setPoints] = useState(50); // User's points

  const handleAnswer = (answer: React.SetStateAction<string>) => {
    setSelectedAnswer(answer);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setIsCorrect(true);
      setPoints((prev) => prev + 10); // Add points
      setStreak((prev) => prev + 1); // Increase streak
      Alert.alert('Correct!', 'Great job 🎉');
    } else {
      setIsCorrect(false);
      setStreak(0); // Reset streak on wrong answer
      Alert.alert('Incorrect', 'Next Question! 😢');
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setIsCorrect(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      Alert.alert('Survey Completed', 'You have reached the end of the Survey!');
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>You must be logged in to attempt questions.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/Login')} // Navigate to login screen
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Top */}
        <TouchableOpacity style={styles.Top} onPress={handleNextQuestion}>
          <Text style={styles.TopText}>Next Question</Text>
        </TouchableOpacity>

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

        <View style={styles.header}>
          <Ionicons name="trophy" size={32} color="#4CAF50" />
          <Text style={styles.headerText}>Question One</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && option === currentQuestion.correctAnswer
                  ? styles.correctOption
                  : selectedAnswer === option && styles.incorrectOption,
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Visual Reward */}
        {isCorrect && (
          <View style={styles.rewardContainer}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
              }}
              style={styles.rewardIcon}
            />
            <Text style={styles.rewardText}>+10 Points</Text>
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
          <Text style={styles.nextButtonText}>Next Question</Text>
        </TouchableOpacity>
      {/* </ScrollView> */}
    {/* </SafeAreaView> */}

    {/* Timing */}
    
    <TouchableOpacity style={styles.Timing} onPress={handleNextQuestion}>
    <Text style={styles.TimingText}>coverage    1/10</Text>
  </TouchableOpacity>
</ScrollView>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles remain the same as provided
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContainer: { paddingHorizontal: '5%', paddingVertical: '5%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#01796F' },
  streakContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  streakText: { fontSize: 16, color: '#FF4500' },
  pointsText: { fontSize: 16, color: '#FFD700' },
  Top: {
    backgroundColor: '#FFF',
    borderRadius: 2,
    padding: 6,
    alignItems: 'center',
    marginVertical: 15,
  },
  TopText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  questionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    borderWidth: 4,
    borderColor: '#01796F', // Dark Green color
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
  correctOption: { backgroundColor: '#C8E6C9', borderWidth: 1, borderColor: '#4CAF50' },
  incorrectOption: { backgroundColor: '#FFCDD2', borderWidth: 1, borderColor: '#F44336' },
  rewardContainer: { alignItems: 'center', marginTop: 20 },
  rewardIcon: { width: 80, height: 80 },
  rewardText: { fontSize: 16, fontWeight: '600', color: '#4CAF50' },
  nextButton: {
    backgroundColor: '#01796F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 15,
  },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  Timing: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: '#006400',
    width: 250,
  
  },
  TimingText: { color: '#01796F', fontWeight: 'bold', fontSize: 16 },
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
});



export default QuestionAnswerScreen;