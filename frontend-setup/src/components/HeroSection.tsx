import { CalendarIcon } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";


const HeroSection = ()=>{
    const navigate = useNavigate();



    const navigateFn = useCallback(()=>{
        navigate('/movies');
        scrollTo(0,0);

    },[]);


    return(
<div
  className="
    flex flex-col items-start justify-center 
    gap-4 
    commonLayoutSpacing
    bg-[url('/backgroundImage.png')]
    h-screen bg-cover bg-center 
  ">

    <img
     src={assets.marvelLogo}
     alt="marvel logo"
     loading="lazy"
     className="max-h-11 lg:h-11 mt-20"
     />
     <h1
     className="text-5xl md:text-[70px] md:leading-18 font-semibold"
     >
        Guardians <br/>
        of the Galaxy
     </h1>


     {/*SHORT SPECIFICATION START */}
     <div className="flex items-center gap-4 text-gray-300">
        <span>
            Action | Adventure | Sci-Fi
        </span>
        
        <div className="flex items-center gap-1">
            <CalendarIcon className="w-4.5 h-4.5"/>
            <span>2018</span>
        </div>

        <div className="flex items-center gap-1">
            <CalendarIcon className="w-4.5 h-4.5"/>
            <span>2h 8m</span>
        </div>
     </div>
     {/*SHORT SPECIFICATION END */}

     {/*SHORT DESCRIPTION START */}
     <p className="max-w-md text-gray-300">
        In a post-apocalytpic world where cities ride on wheels and consume each other
         to survive, two people meet in London and try to stop a conspiracy.
     </p>
     {/*SHORT DESCRIPTION END */}

     {/*BUTTON START */}
     <button
     onClick={navigateFn}
     className="flex items-center gap-1 px-6
      py-3 text-sm bg-primary
      hover:bg-primary-dull transition rounded-full font-medium
       cursor-pointer "
     >
        Explore Movies 


     </button>
     {/*BUTTON END */}




</div>
    )
}

export default HeroSection;