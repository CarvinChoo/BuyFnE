import { create } from "apisauce";

const apiClient = create({
  baseURL: "http://192.168.1.203:9000/api",
  timeout: 30000, // If no connection after 30 secs, stop connecting
});

export default apiClient;
