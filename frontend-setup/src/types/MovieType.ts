export interface Genre {
  id: number;
  name: string;
}

export interface MovieItemInterface {
  _id: string;                 // your Mongo-style string ID
  id: number;                  // numeric TMDB id
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  //eslint-disable-next-line
  casts: any;                  // if you want, I can type this too
  release_date: string;        // "YYYY-MM-DD"
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}


export interface ShowTimeInterface {
  time: string;
  showId: string;
}

export type DateTimeMapInterface = {
  [date: string]: ShowTimeInterface[];   // dynamic keys like "2025-07-24"
};


export interface MovieCastInterface{
    adult: boolean;
  gender: 0 | 1 | 2 | 3; // TMDB enum: 0=unknown, 1=female, 2=male, 3=non-binary
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}


export interface trailerInterface{
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

export interface MovieDetailsPageMovieData{
  _id: string;
  movieId: string;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string; // ISO date string
  original_language: string;
  original_title: string;
  tagline?: string;
  genres: Genre[];
  casts: MovieCastInterface[];
  vote_average: number;
  runtime: number;
  //eslint-disable-next-line
  production_companies: any[];
  createdAt: string;
  updatedAt: string;
  trailer?:trailerInterface;

  __v: number;
}
