import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getAllUniversities() {
  const response = await axiosClient.get(ENDPOINTS.universities);
  return response.data;
}

export async function createUniversity(data) {
  const response = await axiosClient.post(ENDPOINTS.universities, data);
  return response.data;
}

export async function updateUniversity(id, data) {
  const response = await axiosClient.put(`${ENDPOINTS.universities}/${id}`, data);
  return response.data;
}

export async function deleteUniversity(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.universities}/${id}`);
  return response.data;
}
