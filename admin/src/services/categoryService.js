import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getCategories() {
  const response = await axiosClient.get(ENDPOINTS.categories);
  return response.data;
}

export async function createCategory(data) {
  const response = await axiosClient.post(ENDPOINTS.categories, data);
  return response.data;
}

export async function updateCategory(id, data) {
  const response = await axiosClient.put(`${ENDPOINTS.categories}/${id}`, data);
  return response.data;
}

export async function deleteCategory(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.categories}/${id}`);
  return response.data;
}
