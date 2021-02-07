import { useState } from "react";

export default useApi = (apiFunc) => {
  const [data, setData] = useState([]); // use for listing state
  const [error, setError] = useState(false); // used for error state
  const [loading, setLoading] = useState(false); // state for informing that app is requesting from server, used for loading animation

  // function to call listings
  const request = async (...args) => {
    // ...args allow multiple parameters to be accepted if needed
    setLoading(true); // currently requesting
    const response = await apiFunc(...args); // awaits for API layer to retreive and gives listing, ...args spreads the arguments sent into apiFunc
    setLoading(false); // stop requesting

    // Error handling
    if (!response.ok) {
      // if response returns an error
      setError(true); //set error state to true
      return;
    }
    setError(false); //means no error
    setData(response.data); // set current state to listings received
  };

  return { data, error, loading, request };
};
