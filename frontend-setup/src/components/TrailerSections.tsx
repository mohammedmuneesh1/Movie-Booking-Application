import { useState } from "react"
import { dummyTrailers } from "../assets/assets"
import BlurCircle from "./BlurCircle";
import ReactPlayer from "react-player"
import { PlayCircleIcon } from "lucide-react";


const TrailerSection = ()=>{
    //eslint-disable-next-line
    const [currentTrailer,setCurrentTrailer] = useState<any>(dummyTrailers[0]);


    return(
        <div
        className="commonLayoutSpacing overflow-hidden commonGapBetwnComponents" >
            <p className="text-gray-300 font-medium
             text-lg 3xl:text-xl "
             >
             Trailers
            </p>

            <div className="relative mt-6">
                <BlurCircle top="-100px" right="-100px" />
                <ReactPlayer
                src={currentTrailer.videoUrl as string ?? ""}
                controls={false}
                className="max-w-full mx-auto"
                width={"960px"}
                height={"540px"}
                />
            </div>
            
            {/*THE GRID DISPLAY OF THE ITEMS START */}

            <div 
            className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 mt-8 max-w-3xl mx-auto"
            >

                {
                    dummyTrailers?.map((trailer)=>(
                        <div
                        className="relative group-hover:not-hover:opacity-50
                         hover:-translate-y-1 duration-300 transition 
                         max-md:h-60 cursor-pointer"
                         onClick={()=>{
                            setCurrentTrailer(trailer);
                         }}
                        >
                            <img 
                            src={trailer.image}
                            alt="trailer"
                            loading="lazy"
                            className="rounded-lg w-full h-full
                             object-cover brightness-75"
                            />
                            <PlayCircleIcon
                            strokeWidth={1.6}
                            className="absolute top-1/2 left-1/2
                             w-6 md:w-8 h-8 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    ))
                }

            </div>
            {/*THE GRID DISPLAY OF THE ITEMS END */}

        </div>
    )
}


export default TrailerSection;