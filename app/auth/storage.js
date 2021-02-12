// for storage user info for persistance authentication
import * as SecureStore from "expo-secure-store";

// used for authorizing storing and retrieval of data from cache
const key = "authToken";

// used to store authToken so user doesn't get logged out constantly
const storeToken = async (authToken) => {
  // passes an authToken into function to be stored
  try {
    await SecureStore.setItemAsync(key, authToken); // stores authToken
  } catch (error) {
    console.log("Error storing auth token!", error);
  }
};

// used to retrieve from cache when application was restarted or not in focus
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key); // retrieve authToken
  } catch (error) {
    console.log("Error getting auth token!", error);
  }
};

//used when user logs out to remove their info from cache
const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing auth token!", error);
  }
};

export default { getToken, removeToken, storeToken };
