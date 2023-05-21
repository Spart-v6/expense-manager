import AsyncStorage from "@react-native-async-storage/async-storage";

const getUsernameFromStorage = async () => {
  try {
    const username = await AsyncStorage.getItem('username');
    return username || null;
  } catch (error) {
    console.log('Error retrieving username:', error);
    return null;
  }
};

const getCurrencyFromStorage = async () => {
  try {
    const currency = await AsyncStorage.getItem('currency');
    let newCurr = JSON.parse(currency);
    return newCurr || null;
  } catch (error) {
    console.log('Error retrieving currency:', error);
    return null;
  }
}

export { getUsernameFromStorage, getCurrencyFromStorage };
