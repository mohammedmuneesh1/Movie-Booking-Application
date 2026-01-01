// AdminGuard.tsx
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";




const isTokenValid = (token: string) => {
  try {
    const decoded: { exp: number,ia: boolean } = jwtDecode(token);

    if(decoded.ia &&  typeof decoded.ia !== "boolean"){
        return false;
  }
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};



const UserMiddleware = () => {
  const token = localStorage.getItem("token");
  if (!token || !isTokenValid(token)) {
    toast.error("You are not authorized to access user dashboard");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  
  
  return <Outlet />;
};

export default UserMiddleware;

