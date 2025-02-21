import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ActivityIndicator, Image, ScrollView, SafeAreaView } from "react-native";
import { observer } from "mobx-react-lite";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useStores } from "@/store/MobxContext";
import { User } from "@/store/AuthStore"; 


const ProfileScreen = observer(() => {
  const { authStore } = useStores();
  const router = useRouter();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSave = (updates: Partial<User>) => {
    authStore.updateUser(updates);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await authStore.logout();
    router.push("/(tabs)");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Personal Info":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TextInput
              style={styles.input}
              value={authStore.user?.firstName || ""}
              editable={isEditing}
              placeholder="First Name"
              onChangeText={(text) => handleSave({ firstName: text })}
            />
            <TextInput
              style={styles.input}
              value={authStore.user?.lastName || ""}
              editable={isEditing}
              placeholder="Last Name"
              onChangeText={(text) => handleSave({ lastName: text })}
            />
            <TextInput
              style={styles.input}
              value={authStore.user?.email || ""}
              editable={isEditing}
              placeholder="Email"
              onChangeText={(text) => handleSave({ email: text })}
            />
            <TextInput
              style={styles.input}
              value={authStore.user?.phone || ""}
              editable={isEditing}
              placeholder="Phone"
              onChangeText={(text) => handleSave({ phone: text })}
            />
            {isEditing && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case "Security":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <View style={styles.securityRow}>
              <Text style={styles.label}>Enable 2FA</Text>
              <Switch
                value={is2FAEnabled}
                onValueChange={setIs2FAEnabled}
                thumbColor={is2FAEnabled ? "#4CAF50" : "#f4f4f4"}
                trackColor={{ false: "#767577", true: "#A5D6A7" }}
              />
            </View>
          </View>
        );
      case 'Payments':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Payment Preferences</Text>
            <View style={styles.paymentOptionsContainer}>
              <TouchableOpacity style={styles.paymentButtonMtn}>
                <Text style={styles.paymentButtonText}>
                  <FontAwesome name="mobile-phone" size={20} color="#FFF" /> MTN Mobile Money
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentButtonAirtel}>
                <Text style={styles.paymentButtonText}>
                  <FontAwesome name="mobile-phone" size={20} color="#FFF" /> Airtel Mobile Money
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentButtonCreditCard}>
                <Text style={styles.paymentButtonText}>
                  <MaterialCommunityIcons name="credit-card-outline" size={20} color="#FFF" /> Credit Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentButtonPaypal}>
                <Text style={styles.paymentButtonText}>
                  <FontAwesome name="paypal" size={20} color="#FFF" /> PayPal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
            <MaterialCommunityIcons name="dots-vertical" size={36} color="white" style={{ padding: 5 }} />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              {!authStore.user && (
                <>
                  <TouchableOpacity onPress={() => router.push('/Signup')}>
                    <Text style={styles.dropdownText}>Sign Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/Login')}>
                    <Text style={styles.dropdownText}>Login</Text>
                  </TouchableOpacity>
                </>
              )}
              {authStore.user && (
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.dropdownText}>Logout</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.profileSection}>
          {authStore.user && authStore.user.avatar ? (
            <Image source={{ uri: authStore.user.avatar }} style={styles.profileAvatar} />
          ) : (
            <MaterialCommunityIcons name="account" size={36} color="#4CAF50" style={{ padding: 10 }} />
          )}
          <Text style={styles.profileName}>
            {authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Guest User'}
          </Text>
          {authStore.user && (
            <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={{ flex: 1 }}>
          {authStore.user && (
            <View style={styles.tabsContainer}>
              {['Personal Info', 'Security', 'Payments'].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                  <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {renderContent()}
          <View style={styles.additionalSectionContainer}>
            <TouchableOpacity style={styles.additionalRow}>
              <MaterialCommunityIcons name="gift" size={36} color="#FFD700" style={{ padding: 10 }} />
              <Text style={styles.additionalText}>My Rewards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalRow}>
              <FontAwesome name="bell" size={36} color="red" style={{ padding: 10 }} />
              <Text style={styles.additionalText}>Notifications</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerButtonsContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/Login')}>
              <Text style={styles.footerButtonText}>Account Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/Signup')}>
              <Text style={styles.footerButtonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.footerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: '5%',
  },
  header: {
    flexDirection: 'row',
    fontSize: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: '3%',
  },
  headerText: {    
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFF',
  },
  icon: {
    marginLeft: '5%',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 10,
  },
  dropdownText: {
    color: '#FFF',
    paddingVertical: 5,
    
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: '5%',
  },
  profilePic: {
    marginBottom: '3%',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 30, // To make it circular
    marginBottom: 10,
  },
  
  profileName: {
   
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFF',
  },
  editProfileButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: '10%',
    paddingVertical: '2%',
    marginTop: '2%',
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 14,   
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '5%',
    
  },
  tab: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  activeTab: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  
  input: {
    backgroundColor: '#444',
    borderRadius: 5,
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    color: '#FFF',
    marginBottom: '5%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '3%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: '2%',
    paddingHorizontal: '10%',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: '2%',
    paddingHorizontal: '10%',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5%',
  },
  label: {
    fontSize: 14,
    color: '#FFF',
  },
  paymentOption: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: '3%',
  },
  sectionContainer: {
    padding: '5%',
    backgroundColor: '#333',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: '5%',
   
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '5%',
    color: '#FFF',
  },
  
  paymentOptionsContainer: {
    marginTop: '5%',
    color: '#FFF',
  },
  
  paymentButtonMtn: {
    backgroundColor: '#FECB00', // MTN yellow
    paddingVertical: '4%',
    marginBottom: '4%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  paymentButtonAirtel: {
    backgroundColor: '#E30613', // Airtel red
    paddingVertical: '4%',
    marginBottom: '4%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  paymentButtonCreditCard: {
    backgroundColor: '#4CAF50', // Green for credit card
    paddingVertical: '4%',
    marginBottom: '4%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  paymentButtonPaypal: {
    backgroundColor: '#003087', // PayPal blue
    paddingVertical: '4%',
    marginBottom: '4%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  paymentButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 18,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  

  additionalSectionContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: '5%',
    marginBottom: '5%',
  },
  additionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
  },
  additionalIcon: {
    marginRight: '5%',
  },
  additionalText: {
   
    color: '#FFF',
    fontWeight: 'bold',
  },
  
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '5%',
    paddingVertical: '5%',
  },
  
  loginButton: {
    flex: 1,
    marginHorizontal: '1%',
    paddingVertical: '4%',
    borderRadius: 25,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0084FF', // Inspired by Facebook's blue
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  signupButton: {
    flex: 1,
    marginHorizontal: '1%',
    paddingVertical: '4%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759', // Inspired by Duolingo's green
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  logoutButton: {
    flex: 1,
    marginHorizontal: '1%',
    paddingVertical: '4%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30', // Inspired by Telegram's red alert buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  footerButtonText: {
    color: '#FFF',
    fontWeight: '600',  
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  
});

export default ProfileScreen;
