import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import { timeFormat } from "../lib/timeFormat";
import MovieCast from "./movieDetailsPage-components/MovieCast";
import MovieDateSelect from "./movieDetailsPage-components/MovieDateSelect";
import RecommendedMovies from "./movieDetailsPage-components/RecommendedMovies";
import Loading from "../components/Loading";

const  MovieDetailsPage = () => {
  const {id} = useParams();
  const [show,setShow] = useState<null |
  //eslint-disable-next-line
  {movie:any,dateTime:any}>(null);

  const getShow = async()=>{

    const show = dummyShowsData.find((show)=>show._id === id);
    if(show){
      setShow({
        movie:show,
        dateTime:dummyDateTimeData,
      });
    }

  };


  useEffect(()=>{
    getShow();
  },[id]);

  

  return (
    show?(

      <div className="commonLayoutSpacing py-30 md:py-50 overflow-hidden">
{/*----------------------- TOP MOVIE SECTION START ------------------------------- */}

        <div className="flex flex-col md:flex-row gap-8  mx-auto">

          <img
           src={show?.movie?.poster_path}
           alt={show?.movie?.title}
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
  className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
  >
    <Heart 
    className={`w-5 h-5`}
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
<RecommendedMovies
movieData={dummyShowsData}
/>
{/*RECOMMENDED MOVIES END */}



{/*dateSelect */}
      </div>

    ):(
      <Loading/>
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