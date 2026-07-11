import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getToken, removeToken } from '../storage/tokenStorage';
import { resetToLogin } from '../navigation/navigationRef';

const API_BASE_URL = "http://192.168.10.247:5192";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

axiosClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      await removeToken();
      resetToLogin();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
