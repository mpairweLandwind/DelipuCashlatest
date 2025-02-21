import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const HomeScreenBoard: React.FC = () => {
  const trendingVideos = [
    { id: 1, title: 'Cityscapes', thumbnail: 'https://via.placeholder.com/100' },
    { id: 2, title: 'Beaches', thumbnail: 'https://via.placeholder.com/100' },
    { id: 3, title: 'Markets', thumbnail: 'https://via.placeholder.com/100' },
  ];

  const surveys = [
    { id: 1, title: 'Customer Feedback', status: 'Running' },
    { id: 2, title: 'Market Research', status: 'Upcoming' },
  ];
  const paymentOptions = ['PayPal', 'Credit Card', 'Bank Transfer'];

  const [menuVisible, setMenuVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Home Icon, Search, and Menu */}
      <View style={styles.header}>
        <TouchableOpacity>
        <MaterialCommunityIcons name="home" size={30} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#AAA"
        />
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <MaterialCommunityIcons name="menu" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity>
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.menuItem}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.menuItem}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Trending Videos */}
      <Section title="Trending Videos">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {trendingVideos.map((video) => (
            <View key={video.id} style={styles.videoThumbnail}>
             <MaterialCommunityIcons name="video" size={30} color="white" />
              <Text style={styles.videoTitle}>{video.title}</Text>
            </View>
          ))}
        </ScrollView>
      </Section>

      {/* Questions & Rewards */}
      <Section title="Questions & Rewards">
        <View style={styles.questionsContainer}>         
        <MaterialCommunityIcons name="gift" size={36} color="#FFD700" style={{ padding: 10 }} />
          <Text style={styles.questionsText}>Answer today’s question to earn rewards!</Text>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.answerButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.answerButtonText}>Answer Now</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Section>

      {/* Surveys */}
      <Section title="Surveys">
        {surveys.map((survey) => (
          <View key={survey.id} style={styles.surveyItem}>
            <Text style={styles.cardItem}>{survey.title}</Text>
            <Text
              style={
                survey.status === 'Running'
                  ? styles.surveyStatusRunning
                  : styles.surveyStatusUpcoming
              }
            >
              {survey.status}
            </Text>
          </View>
        ))}
      </Section>

      {/* Payment Options */}
      <Section title="Payment Options">
        <Text style={styles.paymentIntro}>
          Earn money by completing surveys and answering questions. Choose a payment method:
        </Text>
        {paymentOptions.map((option, index) => (
          <View key={index} style={styles.paymentOption}>           
            <MaterialCommunityIcons name="cash" size={30} color="#BB86FC" />
            <Text style={styles.cardItem}>{option}</Text>
          </View>
        ))}
      </Section>

      {/* Explore Section */}
      <View style={styles.exploreSection}>
        <Text style={styles.exploreTitle}>Explore</Text>
        <View style={styles.exploreRow}>
          <TouchableOpacity style={styles.exploreItem}>           
            <MaterialCommunityIcons name="compass" size={40} color="white" />
            <Text style={styles.exploreText}>Discover</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreItem}>
          <MaterialCommunityIcons name="account-group" size={40} color="white" />

            <Text style={styles.exploreText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreItem}>
          <MaterialCommunityIcons name="chart-line" size={40} color="white" />
            <Text style={styles.exploreText}>Trends</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: height * 0.02,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    marginRight: 10,
  },
  icon: {
    paddingHorizontal: width * 0.02,
  },
  menuContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  menuItem: {
    fontSize: height * 0.02,
    color: '#FFFFFF',
    marginVertical: 5,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: height * 0.02,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: height * 0.025,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: height * 0.01,
  },
  cardItem: {
    fontSize: height * 0.02,
    color: '#E0E0E0',
    marginVertical: height * 0.005,
  },
  videoThumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  videoTitle: {
    fontSize: height * 0.015,
    color: '#E0E0E0',
    marginTop: 5,
    textAlign: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionsContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },
  questionsText: {
    fontSize: height * 0.02,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  rewardIcon: {
    marginBottom: height * 0.02,
  },
  answerButton: {
    backgroundColor: '#BB86FC',
    borderRadius: 30,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
  },
  answerButtonText: {
    fontSize: height * 0.02,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  surveyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },
  surveyStatusRunning: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  surveyStatusUpcoming: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
  paymentIntro: {
    fontSize: height * 0.018,
    color: '#E0E0E0',
    marginBottom: height * 0.01,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.005,
  },
  exploreSection: {
    marginTop: height * 0.03,
    padding: height * 0.02,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
  },
  exploreTitle: {
    fontSize: height * 0.025,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: height * 0.02,
  },
  exploreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exploreItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.25,
  },
  exploreText: {
    fontSize: height * 0.02,
    color: '#FFFFFF',
    marginTop: 5,
  },
});

export default HomeScreenBoard;
