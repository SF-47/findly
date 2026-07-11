import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Admin } from "../types";

export interface CreateAdminPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role?: string;
  universityId: string | null;
}

export async function getAllAdmins(): Promise<Admin[]> {
  const response = await axiosClient.get<Admin[]>(ENDPOINTS.admins);
  return response.data;
}

export async function getAdminDetails(id: string): Promise<Admin> {
  const response = await axiosClient.get<Admin>(`${ENDPOINTS.admins}/${id}`);
  return response.data;
}

export async function createAdmin(data: CreateAdminPayload): Promise<Admin> {
  const response = await axiosClient.post<Admin>(ENDPOINTS.admins, data);
  return response.data;
}

export async function deleteAdmin(id: string): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.admins}/${id}`);
}
