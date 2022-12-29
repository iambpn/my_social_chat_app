import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
})