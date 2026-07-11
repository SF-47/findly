import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  const response = await axiosClient.get<Category[]>(ENDPOINTS.categories);
  return response.data;
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  const response = await axiosClient.post<Category>(ENDPOINTS.categories, data);
  return response.data;
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<Category> {
  const response = await axiosClient.put<Category>(`${ENDPOINTS.categories}/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.categories}/${id}`);
}
