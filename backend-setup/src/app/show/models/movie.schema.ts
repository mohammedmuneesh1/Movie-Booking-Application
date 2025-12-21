import mongoose, { mongo } from "mongoose";


interface IMovie extends Document {
    title:string;
    movieId:string;
    overview?:string;
    poster_path:string;
    backdrop_path:string;
    release_date:string;
    original_language:string;
    tagline:string;
    genres:string[];
    casts:string[];
    vote_average:string;
    runtime:number;
    production_companies:prodctionCompaniesInterface[];
}


interface prodctionCompaniesInterface{
    id:string;
    logo_path:string;
    name:string;
    origin_country:string;
}



const MovieSchema = new mongoose.Schema({
    movieId:{
     type:String,
     required:true,
    },
    title:{
        type:String,
        required:true
    },
    overview:{
        type:String,
    },
    poster_path:{
        type:String,
        required:true,
    },
    backdrop_path:{
        type:String,
        required:true,
    },
    release_date:{
        type:String,
        required:true,
    },
    original_language:{
        type:String,
    },
    original_title:{
        type:String,
    },
    tagline:{
        type:String,
    },
    genres:{
        type:Array,
        required:true
    },
    casts:{
        type:Array,
        required:true
    },
    vote_average:{
        type:String,
        required:true,
    },
    runtime:{
        type:Number,
        required:true
    },
    production_companies:[
        {
            id:String,
            logo_path:String,
            name:String,
            origin_country:String,
        }
    ],
    status:{
        type:String,
    },


},{
    timestamps:true
});

const MovieModel = mongoose.models.movie || mongoose.model<IMovie>("Movie",MovieSchema);
export default MovieModel;


// vote_count:{
    //     type:String,
    //     required:true,
    // }