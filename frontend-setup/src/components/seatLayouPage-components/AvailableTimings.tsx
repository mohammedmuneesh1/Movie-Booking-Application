import { ClockIcon } from "lucide-react";
import type {  ShowTimeInterface } from "../../types/MovieType";
import isoTimeFormatForCountry from "../../lib/isoTimeFormat";



interface AvailableTimingInterface{
    availableTimingsData:ShowTimeInterface[];
    selectedtime:null | ShowTimeInterface;
    //eslint-disable-next-line 
    setSelectedTime:(val:any)=>void;
}

const AvailableTiming:React.FC<AvailableTimingInterface> = ({availableTimingsData,selectedtime,setSelectedTime})=>{



    if( availableTimingsData.length === 0) return null;
    return(

        <div
        className="max-w-60 w-full bg-primary/10 border text-white
         border-primary/20 rounded-lg py-10
          h-max md:sticky md:top-30 overflow-hidden"
        >
        <p
         className="text-base sm:text-lg
          font-semibold px-6"
         >Available Timing</p>


         {/*MAPPING */}
         <div
          className="mt-5 space-y-1"
          >
            {
                availableTimingsData?.map((timing,index)=>(
                    <div
                    onClick={()=>setSelectedTime(timing)}
                    key={index}
                    className={`flex items-center gap-2 px-6 py-2 w-max
                         rounded-r-md cursor-pointer
                          transition ${selectedtime?.time === timing?.time ? "bg-primary text-white":"hover:bg-primary/20  "}`}
                         
                    // className="text-sm sm:text-base font-medium px-6"
                    >
                        <ClockIcon className="w-4 h-4 " />
                        <p className="text-sm">{
                          isoTimeFormatForCountry(timing.time, "en-IN", "Asia/Kolkata")}
                        </p>
                        
                    </div>
                ))
            }

         </div>




        </div>
    )
}
export default AvailableTiming;