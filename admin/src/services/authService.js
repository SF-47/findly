import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function loginAdmin(data) {
  const response = await axiosClient.post(ENDPOINTS.adminLogin, data);
  return response.data;
}

export async function changePassword(data) {
  const response = await axiosClient.put(ENDPOINTS.changePassword, data);
  return response.data;
}
