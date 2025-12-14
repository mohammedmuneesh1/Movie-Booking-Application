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