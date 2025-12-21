import React, { createContext } from "react";



interface AppContextInterface{
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}


export const AppContext = createContext<AppContextInterface|null>(null);




