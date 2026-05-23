import { Navigate } from "react-router-dom";

function OwnerRoute({ children }) {
  const storedAdmin =
    localStorage.getItem("admin") || sessionStorage.getItem("admin");

  if (!storedAdmin) {
    return <Navigate to="/" replace />;
  }

  try {
    const admin = JSON.parse(storedAdmin);

    if (!admin.token) {
      localStorage.removeItem("admin");
      sessionStorage.removeItem("admin");
      // eslint-disable-next-line react-hooks/error-boundaries
      return <Navigate to="/" replace />;
    }

    if (admin.role !== "Owner") {
      // eslint-disable-next-line react-hooks/error-boundaries
      return <Navigate to="/forbidden" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
    return <Navigate to="/" replace />;
  }
}

export default OwnerRoute;