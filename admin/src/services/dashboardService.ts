import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export interface DashboardSummary {
  totalStudents: number;
  verifiedStudents: number;
  pendingStudents: number;
  totalCategories: number;
  lostItems: number;
  foundItems: number;
  possibleMatches: number;
  totalUniversities: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await axiosClient.get<DashboardSummary>(ENDPOINTS.dashboardSummary);
  return response.data;
}
