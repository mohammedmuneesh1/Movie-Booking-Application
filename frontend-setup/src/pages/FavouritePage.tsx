import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";


const  FavouritePage = () => {

  return (
    dummyShowsData?.length > 0 ?(
      <div
      className="relative 
      py-40 
       commonLayoutSpacing 
       overflow-hidden min-h-[80vh]"
      >
        <BlurCircle top="150px" left="0px"/>
        <BlurCircle bottom="50px" right="50px"/>

        <h1 className="text-lg 3xl:text-xl font-medium my-4 text-gray-300 ">Your Favourite Movies</h1>
        <div
            //  className="flex flex-wrap max-sm:justify-center gap-8 mt-8"
            className="w-full grid grid-cols-2 sm:grid-cols-3 
            md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
        >
          {
            dummyShowsData?.map(
              //eslint-disable-next-line
              (item:any)=>(
           <MovieCard
            movie={item}
             key={item._id}
             />
          ))
          }
        </div>
      </div>

    ):(
      <div
       className="flex flex-col items-center justify-center h-screen"
       >
        <h1
        className=" text-2xl md:text-3xl 3xl:text-4xl font-bold text-center text-gray-300"
        >
          No Movies Available
        </h1>
      </div>

    )

  )
}

export default FavouritePage;
