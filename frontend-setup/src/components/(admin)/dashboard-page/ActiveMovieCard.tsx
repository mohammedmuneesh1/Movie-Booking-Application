import { Star } from 'lucide-react';
import React from 'react'
import { isoDateTimeFormatForCountry } from '../../../lib/isoTimeFormat';




interface ActiveMovieCard{
    data:{
        showDateTime:string;
        showPrice:number;
         movieRef:{
            poster_path:string
             title:string;
             vote_average:number;
         },
    }
    customSyle?:string;
    imgStyle?:string;
    tmdbImageUrl?:string;
}

const ActiveMovieCard:React.FC<ActiveMovieCard> = ({data,customSyle,imgStyle,tmdbImageUrl}) => {

  


    const currency = import.meta.env.VITE_CURRENCY;

  return (
     <div className={`${customSyle} w-[260px] h-full rounded-xl
      overflow-hidden bg-primary/10 
      shadow-md p-3 hover:-translate-y-5  transition-all duration-300 ease-in-out`}
      
      >
      {/* Image */}
      <div className={`w-full ${imgStyle} h-40 rounded-lg overflow-hidden`}>
        <img
          src={tmdbImageUrl ? `${tmdbImageUrl}${data?.movieRef?.poster_path}` : data?.movieRef?.poster_path}
          alt={data?.movieRef?.title}
          className="w-full h-full object-cover "
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 text-white font-semibold text-sm leading-tight">
        {data?.movieRef?.title}
      </h3>

      {/* Price + Rating */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-white text-lg font-bold truncate">{currency} {data?.showPrice}</p>

        <div className="flex items-center gap-1 text-pink-400">
          <Star className="w-4 h-4 fill-pink-500 stroke-pink-500" />
          {
            data?.movieRef?.vote_average && (
              <span className="text-sm text-pink-300">
                {/* {data?.movieRef?.vote_average.toFixed(1)} */}
                {Number(data.movieRef.vote_average).toFixed(1)}
                </span>
            )
          }

        </div>
   
      </div>
           <p className='mt-2 text-sm text-gray-500'>
            {isoDateTimeFormatForCountry(data?.showDateTime)}
        </p>
    </div>
  )
}

export default ActiveMovieCard