import axiosClient from "../api/axiosClient"

import { ENDPOINTS } from "../api/endpoints"

export async function loginStudents(data) {
    const response = await axiosClient.post(ENDPOINTS.studentLogin,data);
    return response.data;
}

export async function registerStudent(data) {
    const response = await axiosClient.post(ENDPOINTS.registerStudent,data);
    return response.data;
}