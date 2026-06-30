import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getAllStudents() {
  const response = await axiosClient.get(ENDPOINTS.students);
  return response.data;
}

export async function createStudent(data) {
  const response = await axiosClient.post(ENDPOINTS.students, data);
  return response.data;
}

export async function updateStudent(id, data) {
  const response = await axiosClient.put(`${ENDPOINTS.students}/${id}`, data);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await axiosClient.delete(`${ENDPOINTS.students}/${id}`);
  return response.data;
}

export async function verifyStudent(id) {
  const response = await axiosClient.put(`${ENDPOINTS.students}/${id}/verify`);
  return response.data;
}
