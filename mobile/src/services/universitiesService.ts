import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { University } from "../types";

export async function getAllUniversities(): Promise<University[]> {
  const response = await axiosClient.get<University[]>(ENDPOINTS.universities);
  return response.data;
}
