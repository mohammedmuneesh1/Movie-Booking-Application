import mongoose, { Document } from "mongoose";
export interface IMovie extends Document {
    title: string;
    movieId: string;
    overview?: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    original_language: string;
    tagline: string;
    genres: any[];
    casts: any[];
    vote_average: string;
    runtime: number;
    production_companies: prodctionCompaniesInterface[];
    trailer: trailerInterface | null;
}
interface prodctionCompaniesInterface {
    id: string;
    logo_path: string;
    name: string;
    origin_country: string;
}
interface trailerInterface {
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
declare const MovieModel: mongoose.Model<IMovie, {}, {}, {}, mongoose.Document<unknown, {}, IMovie, {}, mongoose.DefaultSchemaOptions> & IMovie & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IMovie>;
export default MovieModel;
//# sourceMappingURL=movie.schema.d.ts.map