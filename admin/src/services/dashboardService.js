import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getDashboardSummary() {
  const response = await axiosClient.get(ENDPOINTS.dashboardSummary);
  return response.data;
}
