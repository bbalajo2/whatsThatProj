import React, { Component } from 'react';
import { View, Button, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogoutPress } from '../Users/logout';
import GetUserInfo from '../Users/getUserInfo';
import Search from '../Users/Search';
import { getContacts } from './Contacts';
import { handleDeleteContact } from './Delete';
import { handleBlockUser } from './BlockUser';
import CreateConv from '../Chat/StartConvo';
import ChatList from '../Chat/ConvoList';

const Tab = createBottomTabNavigator();

class ContactsScreen extends Component {
  state = {
    contacts: [],
    errorMessage: null,
    searchText: '',
  }

  async componentDidMount() {
    try {
      const contacts = await getContacts();
      this.setState({ contacts });
    } catch (error) {
      console.log(error);
      this.setState({
        errorMessage: 'Failed to retrieve contacts. Please try again.',
      });
    }
  }

  handleConvoList = () => {
    this.props.navigation.navigate('ChatList');
  }

  renderItem = ({ item }) => (
    <View style={styles.contactRow}>
      <View style={styles.contact}>
        <Text style={styles.details}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.details}>{item.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete" onPress={() => handleDeleteContact(item.user_id)} />
        <Button title="Block" onPress={() => handleBlockUser(item.user_id)} />
      </View>
    </View>
  )

  handleAddContact = () => {
    this.props.navigation.navigate('Search');
  }

  render() {
    return (
      <View><Text style={styles.title}>Contacts</Text>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.contactsContainer}>
              <FlatList
                data={this.state.contacts}
                renderItem={this.renderItem}
              />
            </View>
          </ScrollView>
          <View style={styles.addContactContainer}>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <Button title="Add new contact" onPress={this.handleAddContact} />
          <CreateConv />
          <Button title="View all chats" onPress={this.handleConvoList} />
        </View>
      </View>

    );
  }
}

class SettingsScreen extends Component {
  handleLogout = () => {
    handleLogoutPress();
  }

  handleUserInfo = async () => {
    this.props.navigation.navigate('GetUserInfo');
  }

  handleBlockedUsers = () => {
    this.props.navigation.navigate('BlockedUsers');
  }

  render() {
    return (
      <View>
        <Text style={styles.title}>Settings</Text>
        <GetUserInfo/>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'right' }}>
          <Button title="View Blocked Users" onPress={this.handleBlockedUsers} />
          <Button title="Logout" onPress={this.handleLogout} />
        </View>
      </View>
    );
  }
}

class HomeNavigator extends Component {
  render() {
    const { token } = this.props.route.params;

    return (
      <Tab.Navigator>
        <Tab.Screen name="Contacts" component={ContactsScreen} initialParams={{ token }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F4FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    color: '#9026BA',
    fontSize: 42,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  name: {
    fontSize: 18,
  },
  email: {
    color: 'blue',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingBottom: 10,
  },
  contact: {
    flex: 1,
    backgroundColor: '#9026BA',
  },
  details: {
    fontSize: 18,
    color: '#F9F4FB',
    width: '100%',
    padding: 5,
  },
  buttonContainer: {
    marginLeft: 10,
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
