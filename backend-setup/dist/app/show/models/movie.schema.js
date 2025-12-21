import mongoose, { mongo } from "mongoose";
const MovieSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
    },
    poster_path: {
        type: String,
        required: true,
    },
    backdrop_path: {
        type: String,
        required: true,
    },
    release_date: {
        type: String,
        required: true,
    },
    original_language: {
        type: String,
    },
    original_title: {
        type: String,
    },
    tagline: {
        type: String,
    },
    genres: {
        type: Array,
        required: true
    },
    casts: {
        type: Array,
        required: true
    },
    vote_average: {
        type: String,
        required: true,
    },
    runtime: {
        type: Number,
        required: true
    },
    production_companies: [
        {
            id: String,
            logo_path: String,
            name: String,
            origin_country: String,
        }
    ],
    status: {
        type: String,
    },
}, {
    timestamps: true
});
const MovieModel = mongoose.models.movie || mongoose.model("Movie", MovieSchema);
export default MovieModel;
// vote_count:{
//     type:String,
//     required:true,
// }
//# sourceMappingURL=movie.schema.js.map