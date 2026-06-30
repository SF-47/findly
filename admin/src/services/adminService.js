import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getAllAdmins() {
  const response = await axiosClient.get(ENDPOINTS.admins);
  return response.data;
}

export async function getAdminDetails(id) {
  const response = await axiosClient.get(`${ENDPOINTS.admins}/${id}`);
  return response.data;
}

export async function createAdmin(data) {
  const response = await axiosClient.post(ENDPOINTS.admins, data);
  return response.data;
}

export async function deleteAdmin(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.admins}/${id}`);
  return response.data;
}
