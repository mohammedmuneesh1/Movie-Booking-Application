import ResponseHandler from "../../../utils/responseHandler.js";
import { IS_MOVIE_EIXST_SERVICE } from "../../show/services/show.service.js";
import FavoriteModel from "../models/favourite.schema.js";
export async function ADD_OR_REMOVE_FAVOURITE_MOVIE_CONTROLLER(req, res) {
    const userId = req.user?.id;
    const { movieId } = req.body;
    const isMovieExist = await IS_MOVIE_EIXST_SERVICE(movieId);
    if (!isMovieExist) {
        return ResponseHandler(res, 200, false, null, "Movie dont exist. please try after sometimes.");
    }
    // Try delete first (fast path)
    const deleted = await FavoriteModel.findOneAndDelete({
        user: userId,
        movieRef: isMovieExist?._id,
    });
    if (deleted) {
        return ResponseHandler(res, 200, true, null, "Movie removed from favourite.");
    }
    // If not deleted → add
    await FavoriteModel.create({
        user: userId,
        movieId: isMovieExist.movieId,
        movieRef: isMovieExist._id,
    });
    return ResponseHandler(res, 200, true, null, "Movie added to favourite.");
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
}
export async function GET_USER_ALL_FAVOURITE_MOVIES_CONTROLLER(req, res) {
    const userId = req.user?.id;
    const favouriteMovies = await FavoriteModel.find({ user: userId }).select("-__v -updatedAt ").populate('movieRef');
    return ResponseHandler(res, 200, true, favouriteMovies, "User favourite movie fetched successfully.");
}
//# sourceMappingURL=favourite.controller.js.map