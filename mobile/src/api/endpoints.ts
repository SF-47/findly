export const ENDPOINTS = {
  studentLogin: "/auth/student/login" as const,
  studentsRegister: "/auth/student/register" as const,

  me: "/students/me" as const,

  categories: "/categories" as const,

  universities: "/universities" as const,

  myLostItems: "/students/me/lost-items" as const,
  myFoundItems: "/students/me/found-items" as const,

  studentLostItemsByUniversity: "/students/lost-items" as const,
  studentFoundItemsByUniversity: "/students/found-items" as const,

  createMyLostItem: "/students/me/create/lost-items" as const,
  createMyFoundItem: "/students/me/create/found-items" as const,

  myMatches: "/students/me/matches" as const,

  updatePushToken: "/students/me/push-token" as const,
  changePassword: "/students/me/change-password" as const,

  matchMessages: (matchId: string): string => `/matches/${matchId}/messages`,
  resolveMatch: (matchId: string): string => `/matches/${matchId}/resolve`,

  updateMyLostItem: (id: string): string => `/students/me/lost-items/${id}`,
  deleteMyLostItem: (id: string): string => `/students/me/lost-items/${id}`,
  updateMyFoundItem: (id: string): string => `/students/me/found-items/${id}`,
  deleteMyFoundItem: (id: string): string => `/students/me/found-items/${id}`,
} as const;
