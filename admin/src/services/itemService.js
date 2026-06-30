import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getLostItems() {
  const response = await axiosClient.get(ENDPOINTS.lostItems);
  return response.data;
}

export async function createLostItem(data) {
  const response = await axiosClient.post(ENDPOINTS.lostItems, data);
  return response.data;
}

export async function deleteLostItem(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.lostItems}/${id}`);
  return response.data;
}

export async function getFoundItems() {
  const response = await axiosClient.get(ENDPOINTS.foundItems);
  return response.data;
}

export async function createFoundItem(data) {
  const response = await axiosClient.post(ENDPOINTS.foundItems, data);
  return response.data;
}

export async function deleteFoundItem(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.foundItems}/${id}`);
  return response.data;
}
