import axiosClient from "../api/axiosClient";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export async function getMyNotifications(): Promise<NotificationItem[]> {
  const response = await axiosClient.get<NotificationItem[]>("/notifications");
  return response.data;
}

export async function markAsRead(id: string): Promise<void> {
  await axiosClient.put(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await axiosClient.put("/notifications/read-all");
}

export async function deleteNotification(id: string): Promise<void> {
  await axiosClient.delete(`/notifications/${id}`);
}
