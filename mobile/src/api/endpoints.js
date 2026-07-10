export const ENDPOINTS = {
    studentLogin: "/auth/student/login",
    studentsRegister: "/auth/student/register",

    me: "/students/me",

    categories: "/categories",

    universities:"/universities",

    myLostItems: "/students/me/lost-items",
    myFoundItems: "/students/me/found-items",

    studentLostItemsByUniversity: "/students/lost-items",
    studentFoundItemsByUniversity: "/students/found-items",

    createMyLostItem: "/students/me/create/lost-items",
    createMyFoundItem: "/students/me/create/found-items",

    myMatches: "/students/me/matches",

    updatePushToken: "/students/me/push-token",

    matchMessages: (matchId) => `/matches/${matchId}/messages`,

    updateMyLostItem: (id) => `/students/me/lost-items/${id}`,
    deleteMyLostItem: (id) => `/students/me/lost-items/${id}`,
    updateMyFoundItem: (id) => `/students/me/found-items/${id}`,
    deleteMyFoundItem: (id) => `/students/me/found-items/${id}`,
}
