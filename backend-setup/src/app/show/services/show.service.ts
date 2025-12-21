import ShowModel from "../models/show.schema.js";


export async function GET_ALL_SHOWS_SERVICE(){
    const activeShow = await ShowModel.find({
        showDateTime:{$gte:new Date()}
    }).populate('movieRef').sort({showDateTime:1});

    return activeShow;
}



export async function IS_MOVIE_EXIST_WITH_MOVIE_ID_SERVICE(movieId:string){
    const isMovieExist = await ShowModel.findOne({movieId}); 
    return isMovieExist;
}


export async function IS_MOVIE_EXIST_ON_FAVOURITE_SERVICE(movieId:string,userId:string){
    const isMovieExist = await ShowModel.findOne({movieId,user:userId}); 
    return isMovieExist;
}