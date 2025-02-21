import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface SectionProps {
  title: string;
  items: string[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {items.map((item, index) => (
      <Text key={index} style={styles.cardItem}>
        {item}
      </Text>
    ))}
  </View>
);

const HomeScreenBoard: React.FC = () => {
  // Sample dynamic data
  const rewards = {
    title: "Rewards Earned",
    items: ["Total Points: 2500", "Rewards Redeemed: 5"],
  };

  const surveyParticipation = {
    title: "Survey Participation History",
    items: [
      "Customer Satisfaction Survey - Completed",
      "Market Research Survey - In Progress",
      "Product Feedback Survey - Completed",
    ],
  };

  const paymentTransactions = {
    title: "Payment Transactions",
    items: [
      "Payment to Netflix - $12.99",
      "Payment to Spotify - $9.99",
      "Payment Received from Jane Doe - $150.00",
    ],
  };

  const upcomingEvents = {
    title: "Upcoming Events",
    items: [
      "Black Friday Deals Webinar - Nov 24",
      "Holiday Survey Deadline - Dec 15",
      "New Year Rewards Redemption - Jan 1",
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="home" size={30} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.title}>Delipucash</Text>
        <Icon name="cog" size={30} color="#FFFFFF" style={styles.icon} />
      </View>

      {/* Dynamic Sections */}
      <Section title={rewards.title} items={rewards.items} />
      <Section
        title={surveyParticipation.title}
        items={surveyParticipation.items}
      />
      <Section
        title={paymentTransactions.title}
        items={paymentTransactions.items}
      />
      <Section title={upcomingEvents.title} items={upcomingEvents.items} />
    </ScrollView>
  );
};

// Styles with dark mode design
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
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  icon: {
    paddingHorizontal: width * 0.02,
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
});

export default HomeScreenBoard;
