import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


interface MovieDateSelectInterface{
    //eslint-disable-next-line
    dateTime:Array<any> | {};
    id:string;
}
const MovieDateSelect:React.FC<MovieDateSelectInterface> = ({dateTime,id})=>{
    
    const [selected,setSelected] = useState<null | string>(null);
    const navigate = useNavigate();

    const onBookHandler = ()=>{
        if(!selected){
            return toast.error("Please choose a date");
        }
        navigate(`/movies/${id}/${selected}`);
        scrollTo(0,0);
    }


    return(
        <div
        id="dateSelect"
        className="mt-30 text-white">
            <div className=" flex flex-col md:flex-row z-40
             items-center justify-between 
             gap-10 relative p-8 bg-primary/10 border
              border-primary/20
               rounded-lg
               ">
                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle top="100px" right="0px" />


{/* CHOOSE DATE START */}

<div className="w-full max-w-full ">

  {Object.keys(dateTime).length === 0 ? (
    // 🚫 No shows state
    <div className="mt-6 flex flex-col items-center justify-center text-center
       rounded-lg p-6 w-full">
      
      <p className="text-gray-300 font-semibold capitalize text-base sm:text-lg">
        🎬Oops! Shows currently unavailable
      </p>

      <p className="text-sm text-gray-400 mt-2 max-w-sm font-medium">
        This movie is not running in the selected theatre right now.
        Please check back later or choose another movie.
      </p>
    </div>
  ) : (
    <>
    {/* / ✅ Dates available} */}
  <p className="text-lg font-semibold">Choose Date</p>

    <div className="flex items-center gap-6 text-sm mt-5">
      <ChevronLeftIcon width={28} />

      <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
        {Object.keys(dateTime).map((date) => (
          <button
          key={date}
            onClick={() => setSelected(date)}
            className={`flex flex-col items-center justify-center
              h-14 w-14 aspect-square rounded-lg cursor-pointer
              ${
                selected === date
                  ? "bg-primary text-white"
                  : "border border-primary/70 text-gray-200"
              }`}
          >
            <span>{new Date(date).getDate()}</span>
            <span className="text-xs">
              {new Date(date).toLocaleDateString("en-US", { month: "short" })}
            </span>
          </button>
        ))}
      </span>

      <ChevronRightIcon width={28} />
    </div>
    
            </>
  )}
</div>

{/*BOOK NOW BUTTON START */}
{
    Object.keys(dateTime).length > 0 && (
<button
type="button"
onClick={onBookHandler}
className="bg-primary text-white px-8 text-sm py-2 mt-6 rounded hover:bg-primary/90 whitespace-nowrap transition-all cursor-pointer" >
    Book Now 
</button>

)
}
{/*BOOK NOW BUTTON END */}

{/* CHOOSE DATE END */}



            </div>
        </div>
    )
}
export default MovieDateSelect;