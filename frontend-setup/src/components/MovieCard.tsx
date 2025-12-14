import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { timeFormat } from "../lib/timeFormat";
import { useCallback } from "react";


//eslint-disable-next-line
const MovieCard = ({movie}:{movie:any})=>{
    const navigate = useNavigate();
    
    // const movieByIdNavigate = useCallback(()=>{
    //     navigate(`/movies/${movie._id}`);
    // },[]);

    const movieByIdNavigate =useCallback(()=>{
        navigate(`/movies/${movie._id}`);
    },
[]); 
    return(
        <div
        onClick={movieByIdNavigate}
        className="flex flex-col justify-between p-3
         bg-gray-800 rounded-2xl
          hover:-translate-y-1 transition
           duration-300 max-w-full w-full"
        //    w-66 max-w-full w-full 
        >
            <img
             src={movie?.backdrop_path}
             alt="movie card image"
           onClick={movieByIdNavigate}
             className="rounded-lg h-52 w-full
              object-cover  cursor-pointer"
            //   object-bottom-right
            />

            <p
             className="font-semibold mt-2  
             text-slate-50 hover:text-white
               truncate">
                {movie?.title ?? ""}
            </p>

            <p className="text-sm text-gray-400 mt-2">
                {new Date(movie?.release_date).getFullYear()}
                {" "} 󠁯•󠁏 {" "}
                {movie.genres.slice(0,2).map(
                    //eslint-disable-next-line
                    (genre:any)=>genre.name).join(" | ")}
                    .
                    {timeFormat(movie?.runtime) ?? ""}
            </p>

            <div
            className="flex items-center justify-between mt-4 pb-3"
            >
                <button
                type="button"
                onClick={movieByIdNavigate}
                className="px-4 py-2 text-xs bg-primary
              hover:bg-primary-dull transition rounded-full
               font-medium cursor-pointer text-slate-50 hover:text-white"
                >
               Buy Tickets
                </button>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-slate-50 hover:text-white" >
                <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                {movie?.vote_average.toFixed(1) ?? ""}
            </div>
            </div>


        </div>
    )
}
export default MovieCard;