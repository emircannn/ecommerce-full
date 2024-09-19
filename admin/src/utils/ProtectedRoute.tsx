import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
  return !loading && isAuthenticated ? <Outlet/> : <Navigate to={'/'}/>
}

export default ProtectedRoute