import { Navigate } from "react-router-dom";
import { authService } from "../services/api";

const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    // Redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
