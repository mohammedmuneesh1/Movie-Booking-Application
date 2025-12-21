import React from "react";
import { AppContext } from "./AppContext";


const AppContextProvider = ({children}:{children:React.ReactNode}) => {
    const [isOpen,setIsOpen] = React.useState<boolean>(false);
    return (
        <AppContext.Provider value={{isOpen,setIsOpen}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;