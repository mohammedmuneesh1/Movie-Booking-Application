import { assets } from "../../assets/assets";
import BlurCircle from "../BlurCircle";
import RenderSeats from "./RenderSeats";


interface SelectSeatLayoutInterface {
    groupRows:Array<Array<string>>;
    selectedSeats:string[] ;
    handleSeatclick:(seatId:string)=>void

}

const SelectSeatLayout:React.FC<SelectSeatLayoutInterface> = ({groupRows,handleSeatclick,selectedSeats})=>{
    return(
        <div className="text-white relative flex-1 flex flex-col items-center max-md:mt-16 ">
            <BlurCircle top="-100px" left="-100px" />
            <BlurCircle top="0" right="0px" />
        
        <h1 className=" text-xl sm:text-2xl font-semibold mb-4">Select Your Seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>


        {/*GROUP ROWS START */}
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300 "> 
            
            {/*SINGLE COLUMN CONFIGURATION  START */}

            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6 ">
                {
                    groupRows[0].map((val,index:number)=>(
                        <RenderSeats 
                        row={val}
                        key={index}
                        handleSeatclick={handleSeatclick}
                        selectedSeats={selectedSeats}
                        />
                    ))
                } 
            </div>

        {/*SINGLE COLUMN CONFIGURATION  END */}




{/* DUAL COLUMN CONFIGURATION START */}

            <div className="grid grid-cols-2 gap-11 ">
                    {
                    groupRows.slice(1).map((group,index:number)=>(
                        <div
                        key={index}
                        >
                            {
                                group.map((val,index:number)=>(
                                    <RenderSeats 
                                    row={val}
                                    key={index}
                                    handleSeatclick={handleSeatclick}
                                    selectedSeats={selectedSeats}
                                    />
                                ))
                            }
                        </div>
                    ))
                } 
            </div>
            
{/* DUAL COLUMN CONFIGURATION END */}






            




        </div>
        {/*GROUP ROWS END */}







        </div>
    )
}

export default SelectSeatLayout;