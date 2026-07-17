import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { ItemsMatch, Message } from "../types";

export async function getMyMatches(): Promise<ItemsMatch[]> {
  const response = await axiosClient.get<ItemsMatch[]>(ENDPOINTS.myMatches);
  return response.data;
}

export async function getMatchMessages(matchId: string): Promise<Message[]> {
  const response = await axiosClient.get<Message[]>(ENDPOINTS.matchMessages(matchId));
  return response.data;
}

export async function resolveMatch(matchId: string): Promise<{ message: string }> {
  const response = await axiosClient.post(ENDPOINTS.resolveMatch(matchId));
  return response.data;
}
