import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getAllUniversities() {
  const response = await axiosClient.get(ENDPOINTS.universities);
  return response.data;
}
