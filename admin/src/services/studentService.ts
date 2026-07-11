import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { Student } from "../types";

export async function getAllStudents(): Promise<Student[]> {
  const response = await axiosClient.get<Student[]>(ENDPOINTS.students);
  return response.data;
}

export interface CreateStudentPayload {
  fullName: string;
  email: string;
  password?: string;
  universityId: string;
  universityStudentId: string;
  phoneNumber: string;
  universityCardImageUrl: string;
  expoPushToken?: string | null;
}

export async function createStudent(data: CreateStudentPayload): Promise<Student> {
  const response = await axiosClient.post<Student>(ENDPOINTS.students, data);
  return response.data;
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student> {
  const response = await axiosClient.put<Student>(`${ENDPOINTS.students}/${id}`, data);
  return response.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await axiosClient.delete(`${ENDPOINTS.students}/${id}`);
}

export async function verifyStudent(id: string): Promise<Student> {
  const response = await axiosClient.put<Student>(`${ENDPOINTS.students}/${id}/verify`);
  return response.data;
}
