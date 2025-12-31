import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import { timeFormat } from "../lib/timeFormat";
import MovieCast from "./movieDetailsPage-components/MovieCast";
import MovieDateSelect from "./movieDetailsPage-components/MovieDateSelect";
import RecommendedMovies from "./movieDetailsPage-components/RecommendedMovies";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import axiosInstance from "../configs/axios";
import type { MovieDetailsPageMovieData, trailerInterface } from "../types/MovieType";
import { jwtDecode } from "jwt-decode";
import type { JwtPayloadInterface } from "../types/tokenType";
import { useAppContext } from "../context/useAppContext";

const  MovieDetailsPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  //eslint-disable-next-line
  const { nowPlayingLoading, nowPlaying } = useAppContext();

  //eslint-disable-next-line
  const [show,setShow] = useState<null |{movie:MovieDetailsPageMovieData,dateTime:any,isFavourite:boolean}>(null);
  const [isLoading,setIsLoading ] = useState<boolean>(true);
const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);

  const getShow = async()=>{
    try {
      const res = await axiosInstance.get(`/api/show/${id}`);
      if(res?.data?.success){
        setShow({
          movie:res?.data?.data?.movieData,
          dateTime:res?.data?.data?.dateTime,
          isFavourite:res?.data?.data?.isFavourite,
        });
      }
      else{
        toast.error(res?.data?.response ?? "Technical Issue in fetching movie details. Please try again later.");
      }
    } catch (error) {
      console.error("movie details error",error instanceof Error ? error.message : error);
      toast.error("Technical Issue in fetching movie details. Please try again later.");
      return;
    }

    finally{
      setIsLoading(false)
    }

    // const show = dummyShowsData.find((show)=>show._id === id);
    // if(show){
    //   setShow({
    //     movie:show as any,
    //     dateTime:dummyDateTimeData,
    //   });
    // }

  };


  useEffect(()=>{
    getShow();
  },[id]);




  if(isLoading){
    return <Loading/>;
  }



  const movieImgURL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
  




 const handleFavourite = async ()=>{
  try {

    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    //eslilnt-disable-next-line
    const tokenDecoded: JwtPayloadInterface | null = token ?  jwtDecode(token) : null;
    if(!tokenDecoded?.ia ||  !tokenDecoded?.exp ){
      localStorage.removeItem("token");
        navigate("/login");
        return;
    }
      if(tokenDecoded?.exp * 1000 < Date.now()){
        localStorage.removeItem("token");
        navigate("/login");
        return;
    }

    const res = await axiosInstance.post(`/api/favourites/add-remove`,{
      movieId:show?.movie?._id
    });

    if(res?.data?.success){
      // setisFavourite(!isFavourite);
       setShow((prev)=>{
        if( prev === null ) return null;
        return{
        ...prev,isFavourite:!prev?.isFavourite
        }
      }
    );
      return toast.success(res?.data?.response ?? "Added to favourites.");
    }
    else{
      return toast.error(res?.data?.response ?? "Technical Issue in adding to favourites. Please try again later.");
    }
    return;
  } catch (error) {
    console.error("movie details error",error instanceof Error ? error.message : error);
    return toast.error("Technical Issue in adding to favourites. Please try again later.");
    
  }
 }


  return (
    show?(
      <div className="commonLayoutSpacing py-30 md:py-50 overflow-hidden">
{/*----------------------- TOP MOVIE SECTION START ------------------------------- */}

        <div className="flex flex-col md:flex-row gap-8  mx-auto">

          <img
           src={`${movieImgURL}${show?.movie?.poster_path}`}
           alt={show?.movie?.title ?? "movie title"}
           className="max-md:mx-auto rounded-xl h-104  xl:h-120  max-w-70 xl:max-w-102 object-cover"
           />

           <div className="relative flex flex-col gap-3 w-full">
            <BlurCircle top="-100px" left="-150px" />
            <p className="text-primary">ENGLISH</p>
            <h1
             className="text-4xl font-semibold max-w-96 text-balance text-white"
             >{show?.movie?.title ?? ""}</h1>


{/*STAR RATING START */}

             <div className="flex items-center gap-2 text-gray-300">
              <StarIcon className="w-5 h-5 text-primary fill-primary" />
              {show?.movie?.vote_average ?? ""}
             </div>

{/*STAR RATING END */}

<p className="text-gray-400 mt-2 text-sm sm:text-base leading-tight max-w-xl">
  {show?.movie?.overview ?? ""}
</p>
<p className="text-white  text-[13px] sm:text-sm capitalize tracking-widest ">
  {timeFormat(show?.movie?.runtime ?? 0)} 
 &nbsp; ● &nbsp;

{show?.movie?.genres?.map(
  //eslint-disable-next-line
  (genre: any) => genre?.name).join(", ")}
  &nbsp; ● &nbsp;
  {show?.movie?.release_date && show?.movie?.release_date.split("-")[0]}
</p>


{/* WATCH TRAILER + BUY TICKET START */}
<div className="flex items-center flex-wrap gap-4 mt-4 text-white "> 
  <button
  type="button"
    onClick={() => setIsTrailerOpen(true)}
    className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95 "
    >
    <PlayCircleIcon
    className={`w-5 h-5`}
    />

    Watch Trailer
  </button>
  <a href="#dateSelect"
  className="flex items-center gap-2 px-7 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95 "
  > Buy Tickets </a>
  <button 
  type="button"
  onClick={handleFavourite}
  className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
  >
    <Heart 
    className={`
      w-5 h-5 
      hover:fill-red-500
      transition-colors duration-300
      ease-in-out

      ${show?.isFavourite ?  `fill-red-500 hover:fill-none` : ``}
      
      `}
    />
  </button>

</div>
{/* WATCH TRAILER + BUY TICKET END */}



           </div>

        </div>

{/*----------------------- TOP MOVIE SECTION END ------------------------------- */}


{/*MOVIE CAST START */}
<MovieCast
castData={show?.movie?.casts ?? []}
/>
{/*MOVIE CAST END */}

{/* DATE SELECT START  */}
<MovieDateSelect
 dateTime={show?.dateTime}
 id={id as string}
/>
{/* DATE SELECT END  */}

{/*RECOMMENDED MOVIES START */}

{
  nowPlaying && nowPlaying?.length > 0 && ( 
     <RecommendedMovies
  movieData={nowPlaying?.slice(0,4)}
  />
  )
}
{/*RECOMMENDED MOVIES END */}


{/*TRAILER START */}


{isTrailerOpen && (
  <MovieTrailerModal
  closeModal={() => setIsTrailerOpen(false)}
  trailerData={show?.movie?.trailer ?? {}}
  />
)}


{/*TRAILER END */}





{/*dateSelect */}
      </div>

    ):(
     <>
     {/* <Navigate to="/" replace /> */}
     <span>data not found </span>
     </>
    )
       
  )
}

export default MovieDetailsPage;



// <div className="text-white">

//       <div className="h-screen bg-green-400 ">
//       </div>

//       <div className="h-screen bg-blue-400 ">
//       </div>
      
//       <div className="h-screen bg-red-400 ">
//       </div>

//     </div>





interface MovieTrailerModal{
  closeModal:()=>void;
  trailerData:trailerInterface;
}
const MovieTrailerModal:React.FC<MovieTrailerModal> = ({closeModal,trailerData})=>{
  
  console.log('trailerData?.key',trailerData);

  return(
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    
    {/* backdrop click closes modal */}
    <div
      className="absolute inset-0"
      onClick={() => closeModal()}
    />

    {/* modal box */}
    <div className="relative z-10 w-[90%] max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
      
      {/* close button */}
      <button
        onClick={() => closeModal()}
        className="absolute top-3 right-3 z-20 text-white bg-black/60 hover:bg-black p-2 rounded-full cursor-pointer"
      >
        ✕
      </button>

      {/* trailer */}

       <iframe
            src="https://www.youtube.com/embed/az8M5Mai0X4?si=jItGjW2wvUOcJaR3"
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

{
  trailerData?.key && (
    <iframe
      src={`https://www.youtube.com/embed/${trailerData.key}`}
      className="w-full h-full"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  )
}
      
    </div>
  </div>
  )
}