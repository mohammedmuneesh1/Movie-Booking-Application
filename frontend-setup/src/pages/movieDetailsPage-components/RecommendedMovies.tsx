import { useCallback } from "react";
import MovieCard from "../../components/MovieCard";
import { useNavigate } from "react-router-dom";



interface RecommendedMoviesInterface{
    //eslint-disable-next-line
    movieData:Array<any>;
} 
const RecommendedMovies:React.FC<RecommendedMoviesInterface> = ({movieData})=>{
 
      const navigate = useNavigate();
      const recommendedMoviesNavigate = useCallback(()=>{
            navigate('/movies');
            scrollTo(0,0);
        },[]);

    return(
        movieData ? (
            <div className="mt-30">
            <p className="text-lg font-medium mb-8 capitalize">
                you may also like 
            </p>


{/*GRID START  */}
            <div
            //  className="flex flex-row flex-wrap max-sm:justify-center gap-8"
                 className="w-full grid grid-cols-2 sm:grid-cols-3 
            md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
             >
                {
                    movieData?.slice(0,4).map((val,index:number)=>(
                        <MovieCard movie={val} key={index}/>
                    ))
                }
            </div>
{/*GRID END */}

                   {/*SHOW MORE BUTTON START */}
            <button
            onClick={recommendedMoviesNavigate}
            type="button"
            className="block
         commonGapBetwnComponents
             mx-auto  capitalize btnCommonDesign  "
            >
                show more 
            </button>
            {/*SHOW MORE BUTTON END */}

        </div>
        ):(
            null
        )
    )
}

export default RecommendedMovies;