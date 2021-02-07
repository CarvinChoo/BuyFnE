// This is an API Layer
import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);

export default {
  getListings,
};
