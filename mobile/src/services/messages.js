import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getMessages(matchId) {
  const response = await axiosClient.get(ENDPOINTS.matchMessages(matchId));
  return response.data;
}

export async function sendMessage(matchId, { content , receiverId }) {
  const response = await axiosClient.post(ENDPOINTS.matchMessages(matchId), {
    content: content , 
    receiverId : receiverId
  });
  return response.data;
}


