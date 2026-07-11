import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { LostItem, FoundItem } from "../types";

export async function getLostItems(): Promise<LostItem[]> {
  const response = await axiosClient.get<LostItem[]>(ENDPOINTS.lostItems);
  return response.data;
}

export async function createLostItem(data: Omit<LostItem, "id" | "createdAt" | "status" | "student" | "category">): Promise<LostItem> {
  const response = await axiosClient.post<LostItem>(ENDPOINTS.lostItems, data);
  return response.data;
}

export async function deleteLostItem(id: string): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.lostItems}/${id}`);
}

export async function getFoundItems(): Promise<FoundItem[]> {
  const response = await axiosClient.get<FoundItem[]>(ENDPOINTS.foundItems);
  return response.data;
}

export async function createFoundItem(data: Omit<FoundItem, "id" | "createdAt" | "status" | "student" | "category">): Promise<FoundItem> {
  const response = await axiosClient.post<FoundItem>(ENDPOINTS.foundItems, data);
  return response.data;
}

export async function deleteFoundItem(id: string): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.foundItems}/${id}`);
}
