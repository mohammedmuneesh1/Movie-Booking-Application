import { type IMovie } from "../models/movie.schema.js";
type Video = {
    site: string;
    type: string;
    official: boolean;
    name: string;
    key: string;
    published_at: string;
};
export declare function getBestPlayableVideo(videos: Video[]): Video | null | undefined;
export declare function GET_ALL_SHOWS_SERVICE(): Promise<any[]>;
export declare function IS_MOVIE_EXIST_WITH_MOVIE_ID_SERVICE(movieId: string): Promise<any>;
export declare function IS_MOVIE_EIXST_SERVICE(movieId: string): Promise<IMovie | null>;
export declare function IS_MOVIE_EXIST_ON_FAVOURITE_SERVICE(movieId: string, userId: string): Promise<any>;
export {};
//# sourceMappingURL=show.service.d.ts.map