import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getMyMatches() {
  const response = await axiosClient.get(ENDPOINTS.myMatches);
  return response.data;
}

export async function getMatchMessages(matchId) {
  const response = await axiosClient.get(ENDPOINTS.matchMessages(matchId));
  return response.data;
}