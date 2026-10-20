import { Navigate, Outlet } from "react-router-dom";

export default function RotaProtegida({ roles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}