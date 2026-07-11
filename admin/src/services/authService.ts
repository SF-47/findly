import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

interface LoginCredentials {
  email: string;
  password: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function loginAdmin(data: LoginCredentials): Promise<{ token: string; admin: any }> {
  const response = await axiosClient.post(ENDPOINTS.adminLogin, data);
  return response.data;
}

export async function changePassword(data: ChangePasswordPayload): Promise<void> {
  await axiosClient.put(ENDPOINTS.changePassword, data);
}
