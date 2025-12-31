import React, { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import axiosInstance from "../configs/axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";



const AppContextProvider = ({children}:{children:React.ReactNode}) => {
    const [isOpen,setIsOpen] = React.useState<boolean>(false);
    //eslint-disable-next-line
    const [isAdmin,setIsAdmin] = React.useState<boolean>(false);
    //eslint-disable-next-line
    const [shows,setShows] = React.useState<null | any[]>(null);
    //eslint-disable-next-line
    const [favouriteMovies,setFavouriteMovies] = React.useState<null | any[]>(null);

    const [nowPlayingLoading,setNowPlayingLoading] = React.useState<boolean>(true);
    //eslint-disable-next-line
    const [nowPlaying,setNowPlaying] = useState<null | Array<any>>(null);

    
    //eslint-disable-next-line
    const [userInfo,setUserInfo] = useState<object | null>(()=>{
        const userInfo = localStorage.getItem('token');
        if(userInfo) {
            return jwtDecode(userInfo);
        }
        return null;
    });

    //eslint-disable-next-line
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');









    //============================ TO CHECK WHEATHER THIS GUY IS ADMIN OR NOT ================================
    
    const fetchIsAdmin = async ()=>{
        try {

            const res = await axiosInstance.get('/api/admin/is-admin');
            if(res?.data?.success === true) {
                setIsAdmin(true);
            }
            if(!res?.data?.success && location.pathname.startsWith('/admin')) {
                navigate('/');
                // setIsAdmin(false);
                toast.error("you are not authorized to access admin dashboard");
            }
        } catch (error) {
            console.error("error AF",error instanceof Error ? error.message : error);


        }
    };

//============================ TO CHECK WHEATHER THIS GUY IS ADMIN OR NOT ================================

//============================ FETCH SHOWS FROM DATABASE ================================

const fetchShows  = async ()=>{
    try {
        const res = await axiosInstance.get('/api/show/all')
        if(res?.data?.success === true) {
            setShows(res?.data?.data);
        } 
        else{
            toast.error(res?.data?.response ?? "Technical Issue in fetching shows. Please try again later.");
        }
    } catch (error) {
        console.error("error FS",error instanceof Error ? error.message : error);
        
    }
}

//============================ FETCH SHOWS FROM DATABASE ================================

//============================ FAVOURITE MOVIES OF THE USER ================================
const fetch_favourite_movies  = async ()=>{
    try {
        const res = await axiosInstance.get('/api/favourites/')
        if(res?.data?.success === true) {
            setFavouriteMovies(res?.data?.data);
        } 
        else{
            toast.error(res?.data?.response ?? "Technical Issue in favourite shows. Please try again later.");
        }
    } catch (error) {
        console.error("error FS",error instanceof Error ? error.message : error);
        
    }
}

//============================ FAVOURITE MOVIES OF THE USER ================================

//============================ NOW PLAYING MOVIES START ================================

  const NOW_PLAYING_MOVIES_API = async () => {
      if(!nowPlaying){
          try {
            const res = await axiosInstance.get("/api/show/unique-shows");
            setNowPlayingLoading(false);
            if (res?.data?.success) {
              setNowPlaying(res?.data?.data ?? null);
            } else {
              return toast.error(
                res?.data?.response ??
                  "Technical Issue in fetching shows. Please try again later."
              );
            }
          } catch (error) {
            setNowPlayingLoading(false);
            console.error("error FS", error instanceof Error ? error.message : error);
            return;
          }
      }
  };
//============================ NOW PLAYING MOVIES  END ================================


useEffect(()=>{
    fetchShows();
    NOW_PLAYING_MOVIES_API();
},[]);





useEffect(() => {
  if (!token) return;
  const decoded: { exp: number } = jwtDecode(token);
  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    navigate("/login");
    return;
  }
  fetchIsAdmin();
}, []);  //add token if required 



const tmdbImageUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;








const values = {
    isOpen,
    setIsOpen,
    shows,
    favouriteMovies,
    isAdmin,
    fetchIsAdmin,
    fetch_favourite_movies,
    tmdbImageUrl,
    userInfo,
    nowPlayingLoading,
    nowPlaying

}

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;