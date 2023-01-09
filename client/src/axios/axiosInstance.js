import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: import.meta.env.DEV,
});
