import { ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import MovieCardSkeletion from "./skeletion/MovieCardSkeletion";
import { useAppContext } from "../context/useAppContext";

const FeaturedSection = () => {
  const navigate = useNavigate();
 //eslint-disable-next-line



  const featuredMoviesNavigate = useCallback(() => {
    navigate("/movies");
    scrollTo(0, 0);
  }, []);

  const { nowPlayingLoading, nowPlaying } = useAppContext();



  return (
    <div
      className="
         commonLayoutSpacing
          overflow-hidden"
    >
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />

        <p className="text-gray-300 font-medium text-lg">Now Showing</p>

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
               "
          />
        </button>
      </div>


      {
        nowPlayingLoading && (
        <div
          className="w-full grid grid-cols-2 sm:grid-cols-3 
  md:grid-cols-4 3xl:grid-cols-5 gap-6 sm:gap-8"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeletion key={index} />
          ))}
        </div>
        )
      }

      {/* CARD MAPPING START */}
      {!nowPlayingLoading && nowPlaying && nowPlaying?.length > 0 ? (
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

      )}
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
  );
};

export default FeaturedSection;
