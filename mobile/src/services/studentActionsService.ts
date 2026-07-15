import axiosClient from "../api/axiosClient";

export interface SupportContact {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export async function getSupportContact(): Promise<SupportContact> {
  const response = await axiosClient.get<SupportContact>("/student-actions/support-contact");
  return response.data;
}