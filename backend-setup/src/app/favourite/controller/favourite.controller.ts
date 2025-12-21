import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middlewares/isAuth.js";
import ResponseHandler from "../../../utils/responseHandler.js";
import { IS_MOVIE_EXIST_ON_FAVOURITE_SERVICE, IS_MOVIE_EXIST_WITH_MOVIE_ID_SERVICE } from "../../show/services/show.service.js";
import FavoriteModel from "../models/favourite.schema.js";



export async function ADD_OR_REMOVE_FAVOURITE_MOVIE_CONTROLLER(req:AuthenticatedRequest,res:Response){
    // interface IFavorite extends Document {
    //   user: mongoose.Schema.Types.ObjectId;
    //   movie: mongoose.Schema.Types.ObjectId;
    //   movieId: string;
    // }


    const userId = req.user?.id;
    const {movieId} = req.body;


    const isMovieExist = await IS_MOVIE_EXIST_WITH_MOVIE_ID_SERVICE(movieId);
    if(!isMovieExist){
        return ResponseHandler(res,200,false,null,"Movie dont exist. please try after sometimes.")
    }


      const deleteResult = await FavoriteModel.deleteOne({
    user: userId,
    movie: isMovieExist._id,
  });


    if (deleteResult.deletedCount === 1) {
    return ResponseHandler(res, 200, true, null, "Movie removed from favourite.");
  }


   // 3️⃣ If nothing deleted → create
      await FavoriteModel.create({
      user: userId,
      movie: isMovieExist._id,
      movieId: isMovieExist.movieId,
    });












    // BOTTOM APPROACH ISSUE : 3 QUERY 
//     const isFavouriteExist =await  IS_MOVIE_EXIST_ON_FAVOURITE_SERVICE(movieId,userId);

//     if(isFavouriteExist){
//         await FavoriteModel.deleteOne({movieId,user:userId});
//         return ResponseHandler(res,200,true,null,"Movie removed from favourite.");
//     }

// await FavoriteModel.create({
//   user: userId,
//   movieRef: isMovieExist?._id,
//   movieId: isMovieExist?.movieId,
// });



return ResponseHandler(res,200,true,null,"Movie added to favourite.");

}



export async function GET_USER_ALL_FAVOURITE_MOVIES_CONTROLLER(req:AuthenticatedRequest,res:Response){
    const userId = req.user?.id;
    const favouriteMovies = await FavoriteModel.find({user:userId}).select("-__v -updatedAt ").populate('movieRef');
    return ResponseHandler(res,200,true,favouriteMovies,"User favourite movie fetched successfully.");
}