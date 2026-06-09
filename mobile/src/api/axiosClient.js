import axios from 'axios';
import { getToken } from '../storage/tokenStorage';
import axiosClient from './../../../admin/src/api/axiosClient';

const API_BASE_URL = "http://192.168.1.105:5192";

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
    const token = getToken();

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;

