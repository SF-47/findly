import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getCategories() {
    const response = await axiosClient.get(ENDPOINTS.categories);
    return response.data;
}