import randomKeyGenerator from "../../lib/randomKeyGenerator";


interface RenderSeatsInterface{
    row:string;
    count?:number;
    selectedSeats:string[];
    handleSeatclick:(seatId:string)=>void;
}

const RenderSeats:React.FC<RenderSeatsInterface> = ({count=9,row,selectedSeats,handleSeatclick})=>{
    return(
    <div key={randomKeyGenerator(row)} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
            {
                Array.from({length:count},(_,i)=>{
                    const seatId = `${row} ${i+1}`;
                    return(
                        <button 
                        type="button"
                        key={seatId}
                        onClick={()=>handleSeatclick(seatId)}
                        className={`w-8 h-8 rounded border border-primary/60 cursor-pointer   text-xs sm:text-sm
                            ${selectedSeats.includes(seatId) && "bg-primary text-white" }
                            `}
                        >
                            {seatId}
                        </button>
                    )
                })
            }
        </div>
    </div>
    )
}
export default RenderSeats;
