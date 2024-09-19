import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedHome = () => {
    const { isAuthenticated, loading } = useAuth();
  return !loading && !isAuthenticated ? <Outlet/> : <Navigate to={'/dashboard'}/>
}

export default ProtectedHome