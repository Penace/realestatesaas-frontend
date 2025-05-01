import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

export default function RequireRole({
  role,
  children,
  requireApproval = false,
}) {
  const { user } = useContext(AuthContext);

  // If no user is logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If user doesn't have the required role, redirect to 404 page
  if (role && user.role !== role) return <Navigate to="/404" replace />;

  // If user requires approval and is not approved, redirect to 404
  if (requireApproval && !user.approved) return <Navigate to="/404" replace />;

  // If all checks pass, render the children components
  return children;
}
