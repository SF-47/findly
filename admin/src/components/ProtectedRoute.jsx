import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const storedAdmin =
  localStorage.getItem("admin") || sessionStorage.getItem("admin");

  if (!storedAdmin) {
    return <Navigate to="/" replace />;
  }

  const admin = JSON.parse(storedAdmin);

  if(!admin.token){
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
    return <Navigate to="/" replace />
  }

  return children;
}

export default ProtectedRoute;


