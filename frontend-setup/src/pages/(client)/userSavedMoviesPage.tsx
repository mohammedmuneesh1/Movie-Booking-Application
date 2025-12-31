import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import MovieCard from '../../components/MovieCard';
import BlurCircle from '../../components/BlurCircle';
import axiosInstance from '../../configs/axios';
import MovieCardSkeletion from '../../components/skeletion/MovieCardSkeletion';
import AdminTitle from '../../components/(admin)/AdminTitle';

const UserSavedMoviesPage = () => {
    
  const [loading,setLoading] = useState<boolean>(true);
  //eslint-disable-next-line
  const [favouriteMovies, setFavouriteMovies] = useState<null | any[]>(null);

  const fetch_favourite_movies  = async ()=>{
    try {
        const res = await axiosInstance.get('/api/favourites/')
        if(res?.data?.success === true) {
            setFavouriteMovies(res?.data?.data);
        } 
        else{
            toast.error(res?.data?.response ?? "Technical Issue in favourite shows. Please try again later.");
        }
    } catch (error) {
      toast.error('Technical Issue in favourite shows. Please try again later.');
      console.error("error FS",error instanceof Error ? error.message : error);
       return; 
    }
     finally{
       setLoading(false);
     }
}

useEffect(()=>{
fetch_favourite_movies();
},[]);


  return (
   <div 
        className="relative 
       overflow-hidden min-h-[80vh]"
    
    >


   <AdminTitle 
      firstTitle="Saved"
      firstTitleClass='text-white'
      secondTitle="Movies"
      />

      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

    {
      loading ? (
                <div
          className="w-full grid grid-cols-2 sm:grid-cols-3 mt-8 
  md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeletion key={index} />
          ))}
        </div>
      ):(

!loading && favouriteMovies && favouriteMovies?.length > 0 ? (
        <div
          //  className="flex flex-wrap max-sm:justify-center gap-8 mt-8"
          className="w-full grid grid-cols-2 sm:grid-cols-3 mt-8
            md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
        >
          {favouriteMovies?.map(
            //eslint-disable-next-line
            (movie: any) => (
              <MovieCard movie={movie} />
            )
          )}
        </div>
      ) : (
 <div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
    ❤️
  </div>

  <h3 className="text-lg font-semibold text-slate-100">
    No Favourite Movies Found
  </h3>

  <p className="mt-2 max-w-sm text-sm text-gray-400">
    You haven&apos;t added any favourite movies yet.
  </p>
</div>

      )

      )
    }







  

    </div>

  )
}

export default UserSavedMoviesPage;