import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const admin =
  localStorage.getItem("admin") || sessionStorage.getItem("admin");

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;