import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getCurrentStudent() {
  const response = await axiosClient.get(ENDPOINTS.me);
  return response.data;
}

export async function updateCurrentStudent(data) {
  const response = await axiosClient.put(ENDPOINTS.me, data);
  return response.data;
}
