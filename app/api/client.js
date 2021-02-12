import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.1.203:9000/api",
  timeout: 30000, // If no connection after 30 secs, stop connecting
});

//Remove if not needed///////////////////////////////////////////////////////
// use to set authToken onto request header to verify for access
apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken(); //retrieve authToken from cache
  if (!authToken) return; // no authToken found in cache
  request.headers["x-auth-token"] = authToken;
});
///////////////////////////////////////////////////////////////////////////////
// Implement Caching within get request//////////////

// reference to apiClient's get function
const get = apiClient.get;

// redefine apiClient.get  / change implemetation of get function
apiClient.get = async (url, params, axiosConfig) => {
  // Before

  //original apiClient get function
  const response = await get(url, params, axiosConfig);

  // After

  //succesfully call the server
  if (response.ok) {
    cache.store(url, response.data); // technically, this is caching every "get" request when "get" function is used
    //(may want to use blacklist/whitelist to cache certain request)
    return response; // returns original response object as the original get function
  }

  // When server response failed

  // get data from cache
  const data = await cache.get(url);

  return data ? { ok: true, data } : response; // either returns a simulated response object (.ok and cache data ) or if not in cache, returns original response that contain error details
};
export default apiClient;
