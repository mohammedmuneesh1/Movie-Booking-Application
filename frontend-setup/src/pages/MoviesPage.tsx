import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useAppContext } from "../context/useAppContext";
import MovieCardSkeletion from "../components/skeletion/MovieCardSkeletion";


const  MoviesPage = () => {
  
  const { nowPlayingLoading, nowPlaying } = useAppContext();



      <div
  
      >

      </div>

    return (

    <div 
        className="relative 
      py-40 
       commonLayoutSpacing 
       overflow-hidden min-h-[80vh]"
    
    >
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

    {
      nowPlayingLoading ? (
                <div
          className="w-full grid grid-cols-2 sm:grid-cols-3 
  md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeletion key={index} />
          ))}
        </div>
      ):(

!nowPlayingLoading && nowPlaying && nowPlaying?.length > 0 ? (
        <div
          //  className="flex flex-wrap max-sm:justify-center gap-8 mt-8"
          className="w-full grid grid-cols-2 sm:grid-cols-3 
            md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
        >
          {nowPlaying?.map(
            //eslint-disable-next-line
            (movie: any) => (
              <MovieCard movie={movie} />
            )
          )}
        </div>
      ) : (
 <div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
    🎟️
  </div>

  <h3 className="text-lg font-semibold text-slate-100">
    No Shows Available
  </h3>

  <p className="mt-2 max-w-sm text-sm text-gray-400">
    There are no shows scheduled for this movie yet.
    Please check back later or choose another date.
  </p>
</div>

      )

      )
    }







  

    </div>

  )


  // return (
  //   dummyShowsData?.length > 0 ?(
  //     <div
  //     className="relative 
  //     py-40 
  //      commonLayoutSpacing 
  //      overflow-hidden min-h-[80vh]"
  //     >
  //       <BlurCircle top="150px" left="0px"/>
  //       <BlurCircle bottom="50px" right="50px"/>

  //       <h1 className="text-lg 3xl:text-xl font-medium my-4 text-gray-300 ">Now Showing </h1>
  //       <div
  //           //  className="flex flex-wrap max-sm:justify-center gap-8 mt-8"
  //           className="w-full grid grid-cols-2 sm:grid-cols-3 
  //           md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
  //       >




  //         {
  //           dummyShowsData?.map(
  //             //eslint-disable-next-line
  //             (item:any)=>(
  //          <MovieCard
  //           movie={item}
  //            key={item._id}
  //            />
  //         ))
  //         }
  //       </div>
  //     </div>

  //   ):(
  //     <div
  //      className="flex flex-col items-center justify-center h-screen"
  //      >
  //       <h1
  //       className=" text-2xl md:text-3xl 3xl:text-4xl font-bold text-center text-gray-300"
  //       >
  //         No Movies Available
  //       </h1>
  //     </div>

  //   )

  // )
}

export default MoviesPage;


    // <div className="text-white">

    //   <div className="h-screen bg-green-400 ">
    //   </div>

    //   <div className="h-screen bg-blue-400 ">
    //   </div>

    //   <div className="h-screen bg-red-400 ">
    //   </div>

    // </div>