import mongoose, { Document } from "mongoose";


export interface IMovie extends Document {
    title:string;
    movieId:string;
    overview?:string;
    poster_path:string;
    backdrop_path:string;
    release_date:string;
    original_language:string;
    tagline:string;
    genres:any[];
    casts:any[];
    vote_average:string;
    runtime:number;
    production_companies:prodctionCompaniesInterface[];
trailer: trailerInterface | null; 

}


interface prodctionCompaniesInterface{
    id:string;
    logo_path:string;
    name:string;
    origin_country:string;
}



interface trailerInterface{
     iso_639_1?: string;
  iso_3166_1?: string;
  name?: string;
  key?: string;
  site?: string;
  size?: number;
  type?: string;
  official?: boolean;
  published_at?: string;
  id?: string;
}



const trailerSchema = new mongoose.Schema({
    iso_639_1: String,
    iso_3166_1: String,
    name: String,
    key: String,
    site: String,
    size: Number,
    type: String,
    official: Boolean,
    published_at: String,
    id: String
}, { _id: false });


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
  trailer: {
    type:trailerSchema,
    default: null,
    },
},{
    timestamps:true
});

const MovieModel = mongoose.model<IMovie>("Movie",MovieSchema);
export default MovieModel;


// vote_count:{
    //     type:String,
    //     required:true,
    // }