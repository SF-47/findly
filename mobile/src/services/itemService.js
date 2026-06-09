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

export async function createMyLostItem(data) {
  const response = await axiosClient.post(ENDPOINTS.createMyLostItem, data);
  return response.data;
}

export async function createMyFoundItem(data) {
  const response = await axiosClient.post(ENDPOINTS.createMyFoundItem, data);
  return response.data;
}