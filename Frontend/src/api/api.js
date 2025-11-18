import axios from "axios";
const api = axios.create({
    baseURL : process.env.REACT_APP_API_URL,
    headers:{
        "Content-Type":"application/json"
    }});
api.interceptors.request.use(config => {
  if (config.url === "/ChatBot") {
  return config; // Skip adding auth header
}
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//removed Authorization: Bearer ${token} 
//The chatbot endpoint doesn't expect/need authentication 
export const chatbotApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;