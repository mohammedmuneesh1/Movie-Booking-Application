// AdminGuard.tsx
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";




const isTokenValid = (token: string) => {
  try {
    const decoded: { exp: number,ia: boolean } = jwtDecode(token);
    if(decoded.ia &&  decoded.ia !== true){
        return false;
  }
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};



const AdminMiddleware = () => {
  const token = localStorage.getItem("token");
  if (!token || !isTokenValid(token)) {
    toast.error("You are not authorized to access admin dashboard");
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
  
  
  return <Outlet />;
};

export default AdminMiddleware;




// ✅ No useEffect
// ✅ No flicker
// ✅ No side-effect navigation
// ✅ Declarative routing
// ✅ Works on every route change automatically
// ✅ This is how React Router wants you to do it