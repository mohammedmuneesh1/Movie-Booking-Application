import axios from "axios";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
import type { Response } from "express";
import ResponseHandler from "../../../utils/responseHandler.js";
import MovieModel from "../models/movie.schema.js";
import ShowModel from "../models/show.schema.js";



//===============================================================================================================================================

/**
 * @desc    Get tmdb india based now playing movies  
 * @route   GET /api/shows/now-playing
 * @access  Private
 * @returns  movie array 
 */


export async function  GET_NOW_PLAYING_MOVIES_CONTROLLER (req:AuthenticatedRequest, res:Response) {



    // const tmdbData = await axios.get(
    //     `${process.env.TMBD_API}/3/movie/now_playing`,
    //     {
    //         headers:{
    //             Authorization:`Bearer ${process.env.TMDB_API_KEY}`
    //         }
    //     }
    // );
    const tmdbData = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing`,
        {
            params:{
            api_key: process.env.TMDB_API_KEY,
              language: 'en-US',  // UI language (for translations)
               page: 1,
                region: 'IN'   // Get movies playing in India

            },
        }
    );

    // const movies = results?.


    if(tmdbData?.status !== 200){
        return ResponseHandler(res,tmdbData?.status,false,null,"Failed to fetch movie data.");
    }
    const movies =  tmdbData?.data?.results
    // console.log('tmdbData',tmdbData?.status);
    // console.log('tmdbData',tmdbData?.data?.results?.length);

return ResponseHandler(res,200,true,{
    movies
},'Movie data fetched successfully.');
 
}


//===============================================================================================================================================




//===============================================================================================================================================
//api to add new show to the database 


/**
 * @desc    an api to add new movie with shows to it
 * @route   GET /api/shows/add-show
 * @access  Private
 * @returns  null 
 */


export async function ADD_NEW_MOVIE_SHOW_CONTROLLER (req:AuthenticatedRequest, res:Response) {

    const {movieId,showsInput,showPrice} = req.body;
    let isMovieExist = await MovieModel.findOne({movieId});
console.log('isMovieExist', isMovieExist);

    if(!isMovieExist){
        console.log('inside it ')
        //IF NOT MOVIE EXIST, FETCH MOVIED DATA FROM TMDB;
        const [movieDetailsResponse,movieCreditsResponse]  = await Promise.all([
        //     movieDetailsResponse → what the movie is
        //    movieCreditsResponse → who made the movie
            axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}`,
                {
                    params:{
                    api_key: process.env.TMDB_API_KEY,
                      language: 'en-US',  // UI language (for translations)
                    },
                }
            ),
 axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
    params:{
    api_key: process.env.TMDB_API_KEY,
      language: 'en-US',  // UI language (for translations)
    },
})
 ]);



 if(movieDetailsResponse?.status !== 200 || movieCreditsResponse?.status !== 200){
    return ResponseHandler(res,movieDetailsResponse?.status,false,null,"Failed to fetch movie data.");
}

 const movieApiData = movieDetailsResponse?.data;
 const movieCreditsData =movieCreditsResponse.data;




const movieDetails = {
    movieId:movieId,
    title:movieApiData.title,
    overview:movieApiData?.overview ?? "",
    poster_path:movieApiData.poster_path,
    backdrop_path:movieApiData.backdrop_path,
    genres:movieApiData?.genres,
    casts:movieCreditsData.cast,
    release_date:movieApiData.release_date,
    original_language:movieApiData.original_language,
    original_title:movieApiData.original_title,
    tagline:movieApiData.tagline || "",
    vote_average:movieApiData.vote_average,
    runtime:movieApiData.runtime,
    // movieCredits:movieCreditsData,
    // shows:showsInput,
    // showPrice:showPrice
};

isMovieExist = await MovieModel.create(movieDetails);
    
}


const showsToCreate:{movieRef:string,movieId:string,showDateTime:Date,showPrice:number,occupiedSeats:Object}[] = [];

//INPUT DATA LOOKS LIKE 
// {
//     "movieId":"1196995",
//     "showsInput":[
//         {
//             "date":"2025-06-05",
//             "time":["16:00"]
//         },
//                {
//             "date":"2025-06-06",
//             "time":["20:00"]
//         }
//     ],
//     "showPrice":300
// }

showsInput.forEach((show:any)=>{
    const showDate = show.date;  // "date":"2026-03-10",
    show.time.forEach((time:any)=>{
         const [hour, minute] = time.split(':').map(Number);
          //Extracts hours and minutes from "8:00" → 8 and 0  ,
          //  Number("00") -> 0, Number("01")  // 1 , Number("10")  // 10
          //8:00 -> [8,0] , 9:00 -> [9,0] , 16:02 -> [16,2] , 16:30 -> [16,30]
        //  console.log('hour',hour,'minute',minute);

        const showDateTime = new Date(showDate);
         //showDateTime 2026-03-10T00:00:00.000Z
            // console.log('showDateTime',showDateTime);

           showDateTime.setHours(hour, minute, 0, 0);

        // const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
            movieRef:isMovieExist._id,
            movieId,
            showDateTime:showDateTime as Date,
            showPrice,
            occupiedSeats:{}
        })
    })
});


if(showsToCreate.length > 0){
 await ShowModel.insertMany(showsToCreate);

}
        

 return ResponseHandler(res,200,true,null,'Movie added successfully.');
}

//===============================================================================================================================================


//===============================================================================================================================================
/**
 * @desc    an api to get all shows from the database
 * @route   GET /api/shows/add-show ⚠️
 * @access  Private⚠️
 * @returns  shows of unique  ⚠️
 */


export async function GET_ALL_SHOWS_CONTROLLER (req:AuthenticatedRequest, res:Response) {

    const shows = await ShowModel.find({
        showDateTime:{$gte:new Date()}
    }).populate('movieRef').sort({showDateTime:1});

    if(!shows?.length){
        return ResponseHandler(res,200,true,null,'Shows not found.');
    }
    //filter unique shows 
    const seenMovieIds = new Set<string>();

     const uniqueShows = shows.filter(show => {
    const movieId = show.movieRef._id.toString();
    if (seenMovieIds.has(movieId)) {
      return false;
    }
    seenMovieIds.add(movieId);
    return true;
   });
    return ResponseHandler(res,200,true,{
        shows:uniqueShows
    },'Shows fetched successfully.');
}



//===============================================================================================================================================

/**
 * @desc    get a single show from the database
 * @route   GET /api/shows/add-show ⚠️
 * @access  Private  ⚠️
 * @returns  null  ⚠️
 */

// {
//   "2025-06-05": [
//     { time: "2025-06-05T10:30:00.000Z", showId: "abc123" },
//     { time: "2025-06-05T14:30:00.000Z", showId: "def456" }
//   ],
//   "2025-06-06": [
//     { time: "2025-06-06T14:30:00.000Z", showId: "ghi789" }
//   ]
// }
export async function GET_SHOWS_BASED_ON_MOVIE_ID_CONTROLLER(req:AuthenticatedRequest, res:Response) {
    const {movieId } = req.params;
    const isMovieExist = await MovieModel.findOne({movieId});
    if(!isMovieExist){
        return ResponseHandler(res,200,false,null,'Movie not found.');
    }

    const shows = await ShowModel.find({
        movieId,
        showDateTime:{$gte:new Date()}
    });
    
    const dateTime:any = {};

    //this function will group shows by date

    shows.forEach((show)=>{
        const date = show.showDateTime.toISOString().split('T')[0];
        //toISOString() converts a JavaScript Date object into a standard ISO 8601 string.

        console.log('show.showDateTime',show.showDateTime);
        if(!dateTime[date]){
            dateTime[date] = [];
        }
        dateTime[date].push({
            time:show.showDateTime,
            showId:show._id,
        });

    });


        
        
           console.log('dateTime',dateTime);

    return ResponseHandler(res,200,true,{
        movieData:isMovieExist,
        dateTime:dateTime,
    },'Shows fetched successfully.');

}



