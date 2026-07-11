import { Admin } from "../src/types";

export function getStoredAdmin(): (Admin & { token?: string }) | null {
  const storedAdmin =
    localStorage.getItem("admin") || sessionStorage.getItem("admin");

  if (!storedAdmin) return null;

  try {
    return JSON.parse(storedAdmin); // JSON.parse converts JSON string into javascript object 
  } catch {
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
    return null;
  }
}

export function isOwner(): boolean {
  const admin = getStoredAdmin();
  return admin?.role === "Owner";  // if admin?.role === "Owner" then true , else false
}

export function isUniversityAdmin(): boolean {
  const admin = getStoredAdmin();
  return admin?.role === "UniversityAdmin";
}
