import randomKeyGenerator from "../../lib/randomKeyGenerator";


interface RenderSeatsInterface{
    row:string;
    count?:number;
    occupiedSeats:string[];
    selectedSeats:string[];
    handleSeatclick:(seatId:string)=>void;
}

const RenderSeats:React.FC<RenderSeatsInterface> = ({count=9,row,selectedSeats,handleSeatclick,occupiedSeats})=>{

    return(
    <div key={randomKeyGenerator(row)} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
            {
                Array.from({length:count},(_,i)=>{
                    const seatId = `${row}${i+1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isOccupied = occupiedSeats.includes(seatId);


                    return(
                        <button 
                        type="button"
                        key={seatId}
                        onClick={()=>handleSeatclick(seatId)}

                        // className={`w-8 h-8 rounded border border-primary/60 cursor-pointer   text-xs sm:text-sm
                        //     ${(selectedSeats.includes(seatId) || occupiedSeats.includes(seatId) ) && "bg-primary text-white" }
                        //     `}

                        className={`
            relative w-8 h-8 rounded border text-xs sm:text-sm overflow-hidden
  ${isOccupied
    ? "bg-gray-600 border-gray-600 text-gray-300 cursor-not-allowed opacity-80"
    : isSelected
    ? "bg-primary border-primary text-white"
    : "border-primary/60 cursor-pointer hover:bg-primary/10"
  }
`}


                        >
                            {seatId}
                            
  {isOccupied && (
    <span className="absolute inset-0 flex items-center
     justify-center
     text-white font-bold text-lg  opacity-50"
     >
      ✕
    </span>
  )}
                        </button>
                    )
                })
            }
        </div>
    </div>
    )
}
export default RenderSeats;
