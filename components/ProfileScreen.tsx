import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const [likes, setLikes] = useState(123);
  const [answered, setAnswered] = useState(3);
  const [rewards, setRewards] = useState(1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile and Settings</Text>        
        <MaterialCommunityIcons name="cog" size={24} color="#333" />

      </View>

      {/* Profile Picture and Edit */}
      <View style={styles.profileContainer}>
        <View style={styles.profilePic}>        
          <MaterialIcons name="account-circle" size={30} color="#4CAF50" />
          
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>Username</Text>
          <TouchableOpacity>           
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#333" />
            
          </TouchableOpacity>
        </View>
      </View>

      {/* User Information */}
      <View style={styles.infoContainer}>
        {['Gender', 'Age', 'Status', 'Profession', 'Member Category'].map((info) => (
          <Text key={info} style={styles.infoText}>{info}</Text>
        ))}
      </View>

      {/* Likes */}
      <View style={styles.likesContainer}>       
        <MaterialCommunityIcons name="thumb-up" size={24} color="#333" />
        <Text style={styles.likesText}>{likes} Likes</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statBox}>
          <Text style={styles.statText}>Answered</Text>
          <Text style={styles.statNumber}>{answered}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statBox}>
          <Text style={styles.statText}>Rewards</Text>
          <Text style={styles.statNumber}>{rewards}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statBox}>
          <Text style={styles.statText}>Performance</Text>
          <MaterialCommunityIcons name="chart-line" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Dashboard Button */}
      <TouchableOpacity style={styles.dashboardButton}>
        <Text style={styles.dashboardButtonText}>My Dashboard</Text>
      </TouchableOpacity>
     
    </View>
  );
};

// Styles with responsiveness
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  headerText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  profilePic: {
    marginBottom: height * 0.01,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: height * 0.025,
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  infoText: {
    fontSize: height * 0.022,
    color: '#666',
    marginVertical: height * 0.005,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.015,
  },
  likesText: {
    fontSize: height * 0.022,
    color: '#333',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.02,
  },
  statBox: {
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    width: width * 0.27,
  },
  statText: {
    fontSize: height * 0.02,
    color: '#333',
    marginBottom: height * 0.005,
  },
  statNumber: {
    fontSize: height * 0.025,
    fontWeight: 'bold',
    color: '#333',
  },
  dashboardButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.3,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: height * 0.015,
  },
  dashboardButtonText: {
    color: '#FFF',
    fontSize: height * 0.022,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingVertical: height * 0.015,
  },
});

export default ProfileScreen;
