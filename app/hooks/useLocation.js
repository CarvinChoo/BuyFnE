// All hook files should start with 'use'

import * as Location from "expo-location";
import { useEffect, useState } from "react";

// This is a custom hook, it stores states and  their functions that can be retrieve and reused at other locations
export default useLocation = () => {
  const [location, setLocation] = useState();

  // Used to request Permission to get location and retreive if granted/////////////
  const getLocation = async () => {
    try {
      const { granted } = await Location.requestPermissionsAsync();
      if (!granted) return; // getting location is optional, if denied, nothing happens

      // Get Last Known Location//////////////////////
      //destructure twice 1st to retreive coordinates and from that, retreive latitude and longitude only
      const {
        coords: { latitude, longitude },
      } = await Location.getLastKnownPositionAsync();
      setLocation({ latitude, longitude }); // set an object with 2 properties
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
  return location;
  //////////////////////////////////////////////////////////////////////
};
