import axios from "axios";
import { getToken } from '../storage/tokenStorage';


const API_BASE_URL = "http://192.168.10.247:5192";

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;

