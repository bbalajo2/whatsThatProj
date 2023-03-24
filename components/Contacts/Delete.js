import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleDeleteContact = async (id) => {
  const token = await AsyncStorage.getItem('session_token');
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/contact`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "X-Authorization": token,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to remove contact.');
    }
    if (response.ok){
        console.log("User sucessfully deleted");
        this.props.navigation.navigate('Home');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to remove contact. Please try again.');
  }
}