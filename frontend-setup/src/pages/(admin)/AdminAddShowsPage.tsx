import { useEffect, useState } from "react";
import AdminTitle from "../../components/(admin)/AdminTitle";
// import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import axiosInstance from "../../configs/axios";
import toast from "react-hot-toast";
import type { AddShowTypeInterface } from "../../types/movieApiType";
import { useAppContext } from "../../context/useAppContext";



const AdminAddShowsPage = ()=>{
    const currency  = import.meta.env.VITE_CURRENCY
    const {tmdbImageUrl} = useAppContext();
    const [nowPlayingMovies,setNowPlayingMovies] = useState<AddShowTypeInterface[]>([]);
    const [selectedMovie,setSelectedMovie] = useState<string | null>(null);
    //eslint-disable-next-line
    const [dateTimeSelection, setDateTimeSelection] = useState<Record<string, any>>({});
    const [dateTimeInput,setDateTimeInput] = useState('');
    const [showPrice,setShowPrice] = useState("");
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [addingShow,setAddingShow] = useState<boolean>(false);




    const fetchNowPlayingMovies = async ()=>{
        //eslint-disable-next-line
        // setNowPlayingMovies(dummyShowsData as any);

        try {
            const res = await axiosInstance.get("/api/show/now-playing");
            setIsLoading(false);
            if(res?.data?.success === true) {
                setNowPlayingMovies(res?.data?.data?.movies ?? []);
            }
            else{
                toast.error(res?.data?.response ?? "Technical Issue in fetching shows. Please try again later.");
                return;
            }
        }
         catch (error) {
            console.error("error FS",error instanceof Error ? error.message : error);
            toast.error("Technical Issue in fetching shows. Please try again later.");
            return;
        }
    }

    useEffect(()=>{
        fetchNowPlayingMovies();
    },[]);




    if(isLoading){                    
        return(
            <Loading/>
        )
    }

    const handleDateTimeAdd = ()=>{


        if(!dateTimeInput) return;


        const [date,time] = dateTimeInput.split('T');
        console.log('datatime',dateTimeInput)
        console.log('date,time',date,time);

        if(!date || !time) return;


          setDateTimeSelection((prev) => {
      const times = prev && prev[date] ? prev[date] : [];
      
     if (!times.includes(time)) {
      return {
        ...prev,
        [date]: [...times, time], // <-- Correct fix
      };
    }
    return prev;
  });



    }



    const handleRemoveTime =
    //eslint-disable-next-line
    (date:any,time:any)=>{
        setDateTimeSelection((prev)=>{
            const filteredTimes = prev[date].filter(
                //eslint-disable-next-line
                (t:any)=> t !== time);

         if (filteredTimes.length === 0) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [date]: _, ...rest } = prev;
  return rest;
}

return {
                ...prev,
                [date]:filteredTimes,
            }
        })
    }


 

const handleSubmit = async ()=>{
    try {
        setAddingShow(true);
        if(!selectedMovie  ){
            toast.error("Please select movie ");
            setAddingShow(false);
            return;
        }
        if( Object.keys(dateTimeSelection)?.length === 0){
            toast.error("Please select movie-date and time");
            setAddingShow(false);
            return;
        }
        if(!showPrice){
            toast.error("Please enter the price for the show.");
            setAddingShow(false);
            return;
        }

        const showsInput = Object.entries(dateTimeSelection).map(([date, time]) => ( 
            {
            date,
            time,
        }    
//         {
//             "date":"2025-06-06",
// //             "time":["20:00"]
//         }
    ));



    const payload = {
        movieId:selectedMovie,
        showsInput:showsInput,
        showPrice:Number(showPrice)
    }

    console.log('payload',payload);

    const res = await axiosInstance.post('/api/show/add-show',payload);


    if(res?.data?.success === true) {
        toast.success(res?.data?.response ?? "Show added successfully.");
        setShowPrice('');
        setDateTimeSelection({});
        setSelectedMovie(null);
        setDateTimeInput('');
    } 
    else{
        toast.error(res?.data?.response ?? "Technical Issue in adding show. Please try again later.");
    }
    } catch (error) {
        console.error("error FS",error instanceof Error ? error.message : error);
        toast.error("Technical Issue in adding show. Please try again later.");
    }
    finally{
    setAddingShow(false);
    }
}

    return(
        <div className=" max-w-full w-full overflow-hidden text-white">
            <AdminTitle
            firstTitle="Add"
            secondTitle="Shows"
            />


            {/* MOVIE GRID START */}

        <div className="mt-6 max-w-full w-full ">
            <h4 className="text-base md:text-lg">Now Playing Movies</h4>


    {/*ADDED MOVIE  GRID START HERE  */}
  {
        nowPlayingMovies?.length > 0 ?(
               <div
             className="relative w-full max-w-full 
              grid 
              xl:grid-cols-6
               lg:grid-cols-5
                sm:grid-cols-4 
                 xs:grid-cols-3 grid-cols-2 gap-4 mt-6 ">
                {
                    nowPlayingMovies.map(
                        //eslint-disable-next-line
                        (movie:any)=>(
                        <div
                        key={movie.id}
                        onClick={()=>setSelectedMovie(movie?.id)}
                        className={`relative max-w-full w-full group
                         cursor-pointer opacity-40 hover:opacity-100 
                          hover:-translate-y-1 transition duration-300`}

                        >
                            <div className={`relative rounded-lg overflow-hidden`}>

                            <img
                            src={`${tmdbImageUrl}/${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full max-w-full brightness-90 "
                            />

                            <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                            <div className="flex items-center gap-1 text-gray-400">
                                <StarIcon
                                className="w-4 h-4 text-primary fill-primary"
                                />
                                {movie.vote_average.toFixed(1)}
                            </div>
                            <p className="text-gray-300">{kConverter(movie?.vote_count)  ?? ""} Votes</p>


                            </div>
                            </div>
                            {selectedMovie === movie?.id && (
                                <div
                                className="absolute top-2 right-2 flex items-center
                                 justify-center bg-primary h-6 w-6 rounded z-40">
                                    <CheckIcon className="w-4 h-4 text-white"
                                    strokeWidth={2.5}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                }
                </div>
        ):(
            <div className="text-sm text-gray-400 mt-4">
                No Movies Found
            </div>
        )
    }

  
                 

{/*ADDED MOVIE  GRID END HERE  */}

            

        </div>

        {/* MOVIE GRID END */}


        {/*THE FILTERATION START */}

        <div className="mt-8">
            <label 
            className="block text-sm font-medium mb-2"
            >Show Price </label>

            {/* PRICE START */}
            <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md bg-primary/15">
                <p className="text-gray-400 text-sm">{currency}</p>

                <input
                min={0}
                type="number"
                value={showPrice}
                onChange={(e)=>{
                    setShowPrice(e.target.value)
                }}
                placeholder="Enter Show Price"
                className="outline-none text-xs sm:text-[13px]"
/>



            </div>
            {/* PRICE END */}

            {/* DATE & TIME SELECTION START */}
            <div className="mt-8">
   <label className="block text-sm font-medium mb-2">Selected Date-Time </label>
            <div className="inline-flex items-center gap-2 border
             border-gray-600 p-1 
             rounded-md
              bg-primary/15
              ">
<input
  type="datetime-local"
  value={dateTimeInput}
  onChange={(e) => setDateTimeInput(e.target.value)}
  placeholder="Enter Show Price"
  className="outline-none text-sm md:w-[250px] text-white"
/>
<button 
onClick={handleDateTimeAdd}
className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
>
    Add Time

</button>


            </div>
            </div>

            {/* DATE & TIME SELECTION END */}



            {/*DISPLAY SELECTED TIME  */}


            {
                Object.keys(dateTimeSelection)?.length > 0 && (
                    <div className="mt-6">
                        <h2 className="mb-2">Selected Date-Time</h2>
                        <ul>
                            {
                                Object.entries(dateTimeSelection).map(([date,times])=>(
                                    <li key={date}>
                                        <div className="font-medium">
                                            {date}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                                            {
                                                times.map(
                                                    //eslint-disable-next-line
                                                    (time:any)=>(
                                                    <div key={time} className="border border-primary px-2 py-1 flex items-center rounded">
                                                        <span>{time}</span>
                                                        <DeleteIcon onClick={()=>handleRemoveTime(date,time)}
                                                        width={15}
                                                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                                                        />
                                                    </div>
                                                ))
                                            }

                                        </div>

                                    </li>
                                ))
                            }
                        </ul>

                    </div>
                )
            }






        </div>

        {/*THE FILTERATION END */}


          {/*ADD SHOW START */}
          <button 
          onClick={handleSubmit}
          disabled={addingShow}
        //   onClick={()=>setAddingShow(true)}
          className="bg-primary text-white px-8 py-2 mt-6 rounded text-sm
          hover:bg-primary/90 transition-all cursor-pointer"
          >
            {
                addingShow ? (
                    <>
                    Adding Show...
                    </>
                ):(
                    <>
                    Add Show
                    </>
                )
            }
          </button>
          {/*ADD SHOW END */}




        </div>
    )
}

export default AdminAddShowsPage;