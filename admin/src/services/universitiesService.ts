import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { University } from "../types";

export async function getAllUniversities(): Promise<University[]> {
  const response = await axiosClient.get<University[]>(ENDPOINTS.universities);
  return response.data;
}

export async function createUniversity(data: Omit<University, "id" | "createdAt">): Promise<University> {
  const response = await axiosClient.post<University>(ENDPOINTS.universities, data);
  return response.data;
}

export async function updateUniversity(id: string, data: Partial<University>): Promise<University> {
  const response = await axiosClient.put<University>(`${ENDPOINTS.universities}/${id}`, data);
  return response.data;
}

export async function deleteUniversity(id: string): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.universities}/${id}`);
}
