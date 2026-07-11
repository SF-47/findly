import React from "react";
import { Navigate } from "react-router-dom";

interface OwnerRouteProps {
  children: React.ReactNode;
}

function OwnerRoute({ children }: OwnerRouteProps) {
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
      return <Navigate to="/" replace />;
    }

    if (admin.role !== "Owner") {
      return <Navigate to="/forbidden" replace />;
    }

    return <>{children}</>;
  } catch {
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
    return <Navigate to="/" replace />;
  }
}

export default OwnerRoute;
