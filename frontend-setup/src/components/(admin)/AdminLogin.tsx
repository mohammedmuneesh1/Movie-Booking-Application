import { useGoogleLogin } from "@react-oauth/google";
import React, { useEffect } from "react";
import axiosInstance from "../../configs/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminLoginPage = () => {
   
    const navigate = useNavigate();
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // handle login logic here
//   };


//eslint-disable-next-line
const googleLogin = useGoogleLogin({
  flow: "auth-code", // IMPORTANT
  onSuccess: async (response) => {
    // response.code ← THIS is what you send to backend
    const res =  await axiosInstance.post("/api/users/login", {
      code: response.code,
    });
    if(res?.data?.success){
        localStorage.setItem("token", res?.data?.data?.token);

        if(res?.data?.data?.isAdmin){
            navigate("/admin");
        }
        else{
        navigate("/user/dashboard/bookings");
        }
        toast.success("Welcome Back");
    }
    else{
        toast.error(res?.data?.response ?? "Technical Issue in login. Please try again later.");
    }
  },

  onError: () => {
    console.log("Google login failed");
  },
});



const tokenValidation = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded: { exp: number; ia: boolean } = jwtDecode(token);

    // 1. Expired token → remove
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return;
    }

        navigate(decoded.ia ? "/admin" : "/user/dashboard", {
      replace: true,
    });

    // 2. Redirect based on role
    // if (decoded.ia === true) {
    //   navigate("/admin", { replace: true });
    // } else {
    //   navigate("/user", { replace: true });
    // }
  } catch {
    // Invalid token
    localStorage.removeItem("token");
  }
};

useEffect(()=>{
    tokenValidation();
},[navigate]);


  return (
    <div className="flex min-h-screen items-center justify-center  p-4 bg-indigo-900">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:bg-gray-900 dark:text-white">
        
        {/* Title */}
        <div className="group mb-8 w-fit cursor-pointer">
          <h1 className="mb-2 text-3xl font-black uppercase transition-transform duration-300 group-hover:scale-105 md:text-4xl">
            Login
          </h1>
          <div className="relative">
            <div className="h-2 w-20 origin-left bg-black transition-all duration-500 ease-out group-hover:w-full dark:bg-white" />
          </div>
        </div>

    

            <button
            onClick={googleLogin}
            type="submit"
            className="w-full border-4 border-black bg-yellow-300 px-6 py-3 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-yellow-200 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:bg-yellow-400 dark:text-black"
          >
        Google Sign In
          </button>


        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="font-bold text-black underline hover:text-gray-700 dark:text-white"
          >
            Do not have an account? SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;



    {/* Form */}
        {/* <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-black text-black dark:text-white">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full border-4 border-black px-4 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-black dark:text-white">
              PASSWORD
            </label>
            <input
              type="password"
              required
              className="w-full border-4 border-black px-4 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
            />
          </div>

          <button
            type="submit"
            className="w-full border-4 border-black bg-yellow-300 px-6 py-3 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-yellow-200 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:bg-yellow-400 dark:text-black"
          >
            LOGIN NOW
          </button>

          <button
            type="button"
            className="cursor-pointer w-full border-4 border-black  px-6 py-3 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5  hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none  "
          >
            Google Login
          </button>

        </form> */}