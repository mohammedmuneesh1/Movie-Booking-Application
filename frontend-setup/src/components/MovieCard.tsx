import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { timeFormat } from "../lib/timeFormat";
import { useCallback } from "react";
import { useAppContext } from "../context/useAppContext";

// {
//     "_id": "694fb63bc0e27e9bdd82e174",
//     "movieRef": {
//         "_id": "694fb63bc0e27e9bdd82e172",
//         "movieId": "1473354",
//         "title": "Sarvam Maya",
//         "overview": "A man who loses his belief in God meets the spirit of a young woman unable to remember what happened to her.",
//         "poster_path": "/5c5FRas3ySsaQ97uVdeFKIl83TT.jpg",
//         "backdrop_path": "/6Zn4PaLwLHFJ2bw7s6B10fHiuAD.jpg",
//         "release_date": "2025-12-25",
//         "original_language": "ml",
//         "original_title": "സർവം മായ",
//         "tagline": "",
//         "genres": [
//             {
//                 "id": 9648,
//                 "name": "Mystery"
//             },
//             {
//                 "id": 35,
//                 "name": "Comedy"
//             }
//         ],
//         "casts": [
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1071561,
//                 "known_for_department": "Acting",
//                 "name": "Nivin Pauly",
//                 "original_name": "Nivin Pauly",
//                 "popularity": 2.4941,
//                 "profile_path": "/6W4nGeMkRWZ5Wj0HAAntu9FWP4f.jpg",
//                 "cast_id": 1,
//                 "character": "Prabhendhu",
//                 "credit_id": "6812868ac4a15e7104aeb373",
//                 "order": 0
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1130154,
//                 "known_for_department": "Acting",
//                 "name": "Aju Varghese",
//                 "original_name": "Aju Varghese",
//                 "popularity": 1.0467,
//                 "profile_path": "/1kP34TpAdUt174VZWCaxHua2sy1.jpg",
//                 "cast_id": 2,
//                 "character": "Roopesh Namboothiri",
//                 "credit_id": "68128691cce65b4194aeb37b",
//                 "order": 1
//             },
//             {
//                 "adult": false,
//                 "gender": 1,
//                 "id": 4550863,
//                 "known_for_department": "Acting",
//                 "name": "Preity Mukhundhan",
//                 "original_name": "Preethi Mukundhan",
//                 "popularity": 0.7369,
//                 "profile_path": "/m3qGm6zD2MIye4PB0OaeaS6wc9v.jpg",
//                 "cast_id": 12,
//                 "character": "Saadhya",
//                 "credit_id": "685afc38444b88b027043224",
//                 "order": 2
//             },
//             {
//                 "adult": false,
//                 "gender": 1,
//                 "id": 3073181,
//                 "known_for_department": "Production",
//                 "name": "Riya Shibu",
//                 "original_name": "Riya Shibu",
//                 "popularity": 49.5803,
//                 "profile_path": "/6L1EJJCfCZRnMMxDeHXq5cFViyk.jpg",
//                 "cast_id": 10,
//                 "character": "Delulu",
//                 "credit_id": "68555b13d441b669a4cc2920",
//                 "order": 3
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1855736,
//                 "known_for_department": "Acting",
//                 "name": "Althaf Salim",
//                 "original_name": "Althaf Salim",
//                 "popularity": 0.4364,
//                 "profile_path": "/wYFAsF8f4Ak26c4t5J1IfBBxP0W.jpg",
//                 "cast_id": 11,
//                 "character": "",
//                 "credit_id": "685ab1d3c452e49cff796d93",
//                 "order": 4
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1089125,
//                 "known_for_department": "Acting",
//                 "name": "Madhu Warrier",
//                 "original_name": "Madhu Warrier",
//                 "popularity": 1.3341,
//                 "profile_path": "/onhgu1nP71obIdgqH05N1Z4TeMe.jpg",
//                 "cast_id": 18,
//                 "character": "Deepu",
//                 "credit_id": "68ea4ed07fbe5843a1c3dc27",
//                 "order": 5
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1199055,
//                 "known_for_department": "Acting",
//                 "name": "Janardhanan",
//                 "original_name": "Janardhanan",
//                 "popularity": 0.967,
//                 "profile_path": "/aZB2VxD5iyugCnzCPyQbMOrzRls.jpg",
//                 "cast_id": 19,
//                 "character": "Vellyachan",
//                 "credit_id": "68ea4ef536a0ae45291f632a",
//                 "order": 6
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 3491197,
//                 "known_for_department": "Directing",
//                 "name": "Anand Ekarshi",
//                 "original_name": "Anand Ekarshi",
//                 "popularity": 0.0545,
//                 "profile_path": "/kPc7G9Qd7NM3caoH8CeZY6laeAc.jpg",
//                 "cast_id": 20,
//                 "character": "",
//                 "credit_id": "68ea4f171b0846a195645755",
//                 "order": 7
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 3046142,
//                 "known_for_department": "Acting",
//                 "name": "Arun Ajikumar",
//                 "original_name": "Arun Ajikumar",
//                 "popularity": 0.2509,
//                 "profile_path": "/aqLi5v00vZCf6GCqr84ZMYrh94q.jpg",
//                 "cast_id": 28,
//                 "character": "Sreerag",
//                 "credit_id": "691381026e28e62421875c93",
//                 "order": 8
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1158785,
//                 "known_for_department": "Writing",
//                 "name": "Raghunath Paleri",
//                 "original_name": "Raghunath Paleri",
//                 "popularity": 1.328,
//                 "profile_path": "/5I51oMsdRaKkdqT9kOhCmHGsK3a.jpg",
//                 "cast_id": 30,
//                 "character": "Neelakandan Namboothiri",
//                 "credit_id": "694551a1eb0466f518fb060d",
//                 "order": 9
//             },
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 1171340,
//                 "known_for_department": "Directing",
//                 "name": "Alphonse Puthren",
//                 "original_name": "Alphonse Puthren",
//                 "popularity": 1.0562,
//                 "profile_path": "/bizV6LQMKMCEAVzeIh5rEOty7av.jpg",
//                 "cast_id": 31,
//                 "character": "Dr. Rafael",
//                 "credit_id": "694b74cabf7d0585638cf0cf",
//                 "order": 10
//             }
//         ],
//         "vote_average": "8.5",
//         "runtime": 147,
//         "production_companies": [],
//         "createdAt": "2025-12-27T10:34:35.169Z",
//         "updatedAt": "2025-12-27T10:34:35.169Z",
//         "__v": 0
//     },
//     "movieId": "1473354",
//     "showDateTime": "2026-05-20T03:30:00.000Z",
//     "showPrice": 150,
//     "occupiedSeats": {},
//     "__v": 0,
//     "createdAt": "2025-12-27T10:34:35.273Z",
//     "updatedAt": "2025-12-27T10:34:35.273Z"
// }


//eslint-disable-next-line
const MovieCard = ({movie}:{movie:any})=>{
    console.log('movie',movie);
    const navigate = useNavigate();


    const {tmdbImageUrl} = useAppContext();
    
    // const movieByIdNavigate = useCallback(()=>{
    //     navigate(`/movies/${movie._id}`);
    // },[]);

    const movieByIdNavigate =useCallback(()=>{
        navigate(`/movies/${movie._id}`);
    },
[]); 
    return(
        <div
        onClick={movieByIdNavigate}
        className="flex flex-col justify-between p-3
         bg-gray-800 rounded-2xl
          hover:-translate-y-1 transition
           duration-300 max-w-full w-full"
        //    w-66 max-w-full w-full 
        >
            <img
             src={tmdbImageUrl ? `${tmdbImageUrl}${movie?.movieRef?.backdrop_path}` : movie?.movieRef?.backdrop_path}
             alt="movie card image"
           onClick={movieByIdNavigate}
             className="rounded-lg h-auto w-full
              object-cover  cursor-pointer"
            //  className="rounded-lg h-52 w-full
            //   object-cover  cursor-pointer"
            //   object-bottom-right
            />

            <p
             className="font-semibold mt-2  
             text-slate-50 hover:text-white
               truncate">
                {movie?.movieRef?.title ?? ""}
            </p>

            <p className="text-sm text-gray-400 mt-2">
                {new Date(movie?.movieRef?.release_date).getFullYear()}
                {" "} 󠁯•󠁏 {" "}
                {movie?.movieRef?.genres && movie?.movieRef?.genres.slice(0,2).map(
                    //eslint-disable-next-line
                    (genre:any)=>genre.name).join(" | ")}
                    .
                    {timeFormat(movie?.movieRef?.runtime) ?? ""}
            </p>

            <div
            className="flex items-center justify-between mt-4 pb-3"
            >
                <button
                type="button"
                onClick={movieByIdNavigate}
                className="px-4 py-2 text-xs bg-primary
              hover:bg-primary-dull transition rounded-full
               font-medium cursor-pointer text-slate-50 hover:text-white"
                >
               Buy Tickets
                </button>


{
    movie?.movieRef?.vote_average && (
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-slate-50 hover:text-white" >
                <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                {Number(movie?.movieRef?.vote_average).toFixed(1) ?? ""}
            </div>
    )
}
            </div>


        </div>
    )
}
export default MovieCard;