import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Student } from "../types";

export interface LoginCredentials {
  email: string;
  password?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  isVerified: boolean;
  student: Student;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  universityId: string;
  universityStudentId: string;
  universityCardImageUrl: string;
  [key: string]: any;
}

export interface RegisterResponse {
  student: Student;
  [key: string]: any;
}

export async function loginStudent(data: LoginCredentials): Promise<LoginResponse> {
  const response = await axiosClient.post<LoginResponse>(ENDPOINTS.studentLogin, data);
  return response.data;
}

export async function registerStudent(data: RegisterCredentials): Promise<RegisterResponse> {
  const response = await axiosClient.post<RegisterResponse>(ENDPOINTS.studentsRegister, data);
  return response.data;
}
