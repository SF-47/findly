import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { ItemsMatch } from "../types";

export async function getMatches(): Promise<ItemsMatch[]> {
  const response = await axiosClient.get<ItemsMatch[]>(ENDPOINTS.matches);
  return response.data;
}

export async function updateMatchStatus(id: string, status: string): Promise<ItemsMatch> {
  const response = await axiosClient.patch<ItemsMatch>(`${ENDPOINTS.matches}/${id}/status`, { status });
  return response.data;
}

export async function deleteMatch(id: string): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.matches}/${id}`);
}
