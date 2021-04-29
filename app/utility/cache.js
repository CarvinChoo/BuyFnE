import { AsyncStorage } from "react-native";
import moment from "moment";

const prefix = "cache";
const expiryInMinutes = 5; // pre defined expiry time difference

//function to store item in asyncstorage (cache)
const store = async (key, value) => {
  try {
    // item to be added to cache
    const item = {
      value,
      timestamp: Date.now(), // set a timestamp in the item
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item)); // add the item into asyncstorage
  } catch (error) {
    console.log(error);
  }
};

// function to handle second responsiblity, to check if item has expired
const isExpired = (item) => {
  // current datetime
  const now = moment(Date.now());

  //retrieved item timestamp
  const storedTime = moment(item.timestamp);

  // Returns boolean True if timestamp has expired
  return now.diff(storedTime, "minutes") > expiryInMinutes; // now.diff(storedTime, "minutes") returns difference in "minutes" between now and storedTime
};

//function to retreive item from asyncstorage (cache)
const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key); // retrive item from asyncstorage
    const item = JSON.parse(value); // convert the returned string into an object

    // if item does not exist in cache
    if (!item) return null;

    // Single responsibility principle, where each function should only have 1 responsibility
    // this is now a second responsibility as function is already getting an item from cache
    // now it is also detecting if item in cache has expired as well.
    // * responsiblity has been moved to its own function ( isExpired() )

    //if item has expired
    if (isExpired(item)) {
      // Command Query Seperation (CQS) rule
      //Changes to state and query for state should not be done in the same function
      // we are breaking the rules below by changing the state but it is okay in this situation as it helps with clearing out useless data

      // removes expired object in cache (clean up)
      await AsyncStorage.removeItem(prefix + key);

      return null;
    }
    // returning item that has not expired
    return item.value;

    // error catching
  } catch (error) {
    console.log(error); // logs error in console
  }
};

export default {
  store,
  get,
};
