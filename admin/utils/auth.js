export function getStoredAdmin() {
  const storedAdmin =
    localStorage.getItem("admin") || sessionStorage.getItem("admin");

  if (!storedAdmin) return null;

  try {
    return JSON.parse(storedAdmin);//JSON.parse converts JSON string into javascript object 
  } catch {
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
    return null;
  }
}

export function isOwner() {
  const admin = getStoredAdmin();
  return admin?.role === "Owner";
}

export function isUniversityAdmin() {
  const admin = getStoredAdmin();
  return admin?.role === "UniversityAdmin";
}