import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  const response = await axiosClient.get<Category[]>(ENDPOINTS.categories);
  return response.data;
}
