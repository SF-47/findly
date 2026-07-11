import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Student } from "../types";

export async function getCurrentStudent(): Promise<Student> {
  const response = await axiosClient.get<Student>(ENDPOINTS.me);
  return response.data;
}

export async function updateCurrentStudent(data: Partial<Student> | Record<string, any>): Promise<Student> {
  const response = await axiosClient.put<Student>(ENDPOINTS.me, data);
  return response.data;
}

export async function updatePushToken(pushToken: string): Promise<{ message?: string } & any> {
  const response = await axiosClient.put(ENDPOINTS.updatePushToken, { pushToken });
  return response.data;
}
