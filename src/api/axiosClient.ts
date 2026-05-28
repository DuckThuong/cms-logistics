import axios from "axios";
import { ROUTER_PATH } from "../router/Route";

const BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access. Redirecting to login.");
      window.location.href = ROUTER_PATH.SIGN_IN;
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
