import axiosClient from "../api/axiosClient";

import { ENDPOINTS } from "../api/endpoints";

export async function loginStudent(data) {
  const response = await axiosClient.post(ENDPOINTS.studentLogin, data);
  return response.data;
}

export async function registerStudent(data) {
  const response = await axiosClient.post(ENDPOINTS.studentsRegister, data);
  return response.data;
}
