import { useAuth } from "@/contexts/AuthProvider";
import { useUser } from "@/contexts/UserContext";
import Sidebar from "@/layout/UserPanel/Sidebar";
import VerifyUser from "@/layout/UserPanel/VerifyUser";
import { cn } from "@/lib/utils";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const {user} = useUser();
  return !loading && isAuthenticated ? 
  <div className="h-screen w-screen overflow-hidden">
    {!user?.email_verified && !loading ? <VerifyUser/> : null}
    <section className={cn("flex gap-5 p-3 lg:p-5 w-screen", user?.email_verified ? 'h-screen' : 'h-[calc(100vh_-_56px)] md:h-[calc(100vh_-_36px)]')}>
      <Sidebar/>
      <main className="flex-1 h-full w-full overflow-hidden relative">
      <Outlet/>
      </main>
    </section>
  </div>
  : <Navigate to={'/'}/>
}

export default ProtectedRoute