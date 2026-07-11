import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Message } from "../types";

export interface SendMessageData {
  content: string;
  receiverId: string;
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const response = await axiosClient.get<Message[]>(ENDPOINTS.matchMessages(matchId));
  return response.data;
}

export async function sendMessage(
  matchId: string,
  { content, receiverId }: SendMessageData,
): Promise<Message> {
  const response = await axiosClient.post<Message>(ENDPOINTS.matchMessages(matchId), {
    content,
    receiverId,
  });
  return response.data;
}
