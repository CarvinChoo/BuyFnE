// Api layer for POSTing new user info into server under "/users"
import client from "./client";

const register = (userInfo) => client.post("/users", userInfo); // addition fields for users can be set in RegisterScreen in the future

export default { register };
