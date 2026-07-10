import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getMyLostItems() {
  const response = await axiosClient.get(ENDPOINTS.myLostItems);
  return response.data;
}

export async function getMyFoundItems() {
  const response = await axiosClient.get(ENDPOINTS.myFoundItems);
  return response.data;
}

export async function getStudentLostItemsByUniversity() {
  const response = await axiosClient.get(ENDPOINTS.studentLostItemsByUniversity);
  return response.data;
}

export async function getStudentFoundItemsByUniversity() {
  const response = await axiosClient.get(ENDPOINTS.studentFoundItemsByUniversity);
  return response.data;
}

export async function createMyLostItem(data) {
  const response = await axiosClient.post(ENDPOINTS.createMyLostItem, data);
  return response.data;
}

export async function createMyFoundItem(data) {
  const response = await axiosClient.post(ENDPOINTS.createMyFoundItem, data);
  return response.data;
}

export async function updateMyLostItem(id, data) {
  const response = await axiosClient.put(ENDPOINTS.updateMyLostItem(id), data);
  return response.data;
}

export async function deleteMyLostItem(id) {
  const response = await axiosClient.delete(ENDPOINTS.deleteMyLostItem(id));
  return response.data;
}

export async function updateMyFoundItem(id, data) {
  const response = await axiosClient.put(ENDPOINTS.updateMyFoundItem(id), data);
  return response.data;
}

export async function deleteMyFoundItem(id) {
  const response = await axiosClient.delete(ENDPOINTS.deleteMyFoundItem(id));
  return response.data;
}
