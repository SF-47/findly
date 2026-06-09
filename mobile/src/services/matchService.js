import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getMyMatches() {
  const response = await axiosClient.get(ENDPOINTS.myMatches);
  return response.data;
}