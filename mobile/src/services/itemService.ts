import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { LostItem, FoundItem } from "../types";

export async function getMyLostItems(): Promise<LostItem[]> {
  const response = await axiosClient.get<LostItem[]>(ENDPOINTS.myLostItems);
  return response.data;
}

export async function getMyFoundItems(): Promise<FoundItem[]> {
  const response = await axiosClient.get<FoundItem[]>(ENDPOINTS.myFoundItems);
  return response.data;
}

export async function getStudentLostItemsByUniversity(): Promise<LostItem[]> {
  const response = await axiosClient.get<LostItem[]>(ENDPOINTS.studentLostItemsByUniversity);
  return response.data;
}

export async function getStudentFoundItemsByUniversity(): Promise<FoundItem[]> {
  const response = await axiosClient.get<FoundItem[]>(ENDPOINTS.studentFoundItemsByUniversity);
  return response.data;
}

export async function createMyLostItem(data: Omit<LostItem, 'id' | 'studentId' | 'student' | 'category' | 'createdAt'> | Record<string, any>): Promise<LostItem> {
  const response = await axiosClient.post<LostItem>(ENDPOINTS.createMyLostItem, data);
  return response.data;
}

export async function createMyFoundItem(data: Omit<FoundItem, 'id' | 'studentId' | 'student' | 'category' | 'createdAt'> | Record<string, any>): Promise<FoundItem> {
  const response = await axiosClient.post<FoundItem>(ENDPOINTS.createMyFoundItem, data);
  return response.data;
}

export async function updateMyLostItem(id: string, data: Partial<LostItem> | Record<string, any>): Promise<LostItem> {
  const response = await axiosClient.put<LostItem>(ENDPOINTS.updateMyLostItem(id), data);
  return response.data;
}

export async function deleteMyLostItem(id: string): Promise<{ message?: string } & any> {
  const response = await axiosClient.delete(ENDPOINTS.deleteMyLostItem(id));
  return response.data;
}

export async function updateMyFoundItem(id: string, data: Partial<FoundItem> | Record<string, any>): Promise<FoundItem> {
  const response = await axiosClient.put<FoundItem>(ENDPOINTS.updateMyFoundItem(id), data);
  return response.data;
}

export async function deleteMyFoundItem(id: string): Promise<{ message?: string } & any> {
  const response = await axiosClient.delete(ENDPOINTS.deleteMyFoundItem(id));
  return response.data;
}
