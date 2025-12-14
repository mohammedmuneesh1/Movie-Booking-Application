import { ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "./MovieCard";

const FeaturedSection = ()=>{

    const navigate = useNavigate();

    const featuredMoviesNavigate = useCallback(()=>{
        navigate('/movies');
        scrollTo(0,0);
    },[]);

    return(
        <div
         className="
         commonLayoutSpacing
          overflow-hidden"
         >
            <div
            className="relative flex items-center justify-between pt-20 pb-10"
            >
                <BlurCircle
                top="0"
                right="-80px"
                />

                <p
                className="text-gray-300 font-medium text-lg"
                >Now Showing
                </p>

                <button
                type="button"
                onClick={featuredMoviesNavigate}
                className="group flex items-center gap-2
                 text-sm text-gray-300 cursor-pointer"
                >
              View All 
              <ArrowRight 
              className="group-hover:translate-x-0.5
               transition 
               w-4.5 h-4.5
               "/>
                </button>

            </div>


            {/* CARD MAPPING START */}
            <div
            //  className="flex flex-wrap max-sm:justify-center gap-8 mt-8"
            className="w-full grid grid-cols-2 sm:grid-cols-3 
            md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
             >
            {
                dummyShowsData.slice(0,4).map(
                    //eslint-disable-next-line
                    (movie:any)=><MovieCard
                     movie={movie} />)
            }
            </div>
            {/* CARD MAPPING END */}




            {/*SHOW MORE BUTTON START */}
            <button
            onClick={featuredMoviesNavigate}
            type="button"
            className="block
         commonGapBetwnComponents
             mx-auto  capitalize btnCommonDesign  "
            >
                show more 
            </button>
            {/*SHOW MORE BUTTON END */}


        </div>


    )
}

export default FeaturedSection;