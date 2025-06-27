import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ currentUser }) {
  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
