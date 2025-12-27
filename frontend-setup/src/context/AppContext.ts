import React, { createContext } from "react";



interface AppContextInterface{
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    isAdmin:boolean;
    // setIsAdmin:React.Dispatch<React.SetStateAction<boolean>>;
    //eslint-disable-next-line
    shows:any[] | null ;
    //eslint-disable-next-line
    favouriteMovies:any[] |  null;
    fetchIsAdmin:()=>Promise<void>;
    // fetchShows:()=>Promise<void>;
    fetch_favourite_movies:()=>Promise<void>;
    tmdbImageUrl:string;
    userInfo:{ia?:boolean,name?:string} | null;
    nowPlayingLoading:boolean;
    //eslint-disable-next-line
    nowPlaying: Array<any> | null;
}


export const AppContext = createContext<AppContextInterface|null>(null);




