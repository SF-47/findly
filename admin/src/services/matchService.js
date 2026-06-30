import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getMatches() {
  const response = await axiosClient.get(ENDPOINTS.matches);
  return response.data;
}

export async function updateMatchStatus(id, status) {
  const response = await axiosClient.patch(`${ENDPOINTS.matches}/${id}/status`, { status });
  return response.data;
}

export async function deleteMatch(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.matches}/${id}`);
  return response.data;
}
