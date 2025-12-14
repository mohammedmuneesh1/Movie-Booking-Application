import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import type { DateTimeMapInterface, MovieItemInterface, ShowTimeInterface } from "../types/MovieType";
import Loading from "../components/Loading";
import AvailableTiming from "../components/seatLayouPage-components/AvailableTimings";
import SelectSeatLayout from "../components/seatLayouPage-components/SelectSeatLayout";
import toast from "react-hot-toast";
import { ArrowRightIcon } from "lucide-react";

const  SeatLayoutPage = () => {

  const {id,date}  = useParams();

  const [selectedSeats,setSelectedSeats] = useState<null | Array<string> >([]);

  const [selectedtime,setSelectedTime] = useState<null | ShowTimeInterface>(null);

  const [show,setShow] = useState<null | {
    movie:MovieItemInterface,
    dateTime:DateTimeMapInterface,
  }>(null);

  const navigate = useNavigate();



  const getShow = async ()=>{
    if(!id || !date || typeof date === 'undefined') return navigate(-1);
    const show = dummyShowsData
    .find((show)=>show._id === id);
    if(show){
      setShow({
        movie:show,
        dateTime:dummyDateTimeData
      })
    }
  }



  useEffect(()=>{
    getShow();
  },[]);



  const handleSeatClick = (seatId:string)=>{
    //step-1 first movie timing is selected 
    if(!selectedtime) {
      return toast.error("Please choose movie timing");
    }
    
    //already 4 seat seel 5 > 4 
     //⚠️ already four seat selected, then length -- 4 , so this ocoidition will fail 4 >4 , so this condition helps us to add 5th seat 
    if(Array.isArray(selectedSeats) && !selectedSeats?.includes(seatId) && selectedSeats?.length > 4){
      return toast.error("You can select only 5 seats");
    }
    setSelectedSeats((prevSeats)=>( Array.isArray(prevSeats) && prevSeats.includes(seatId)) ? prevSeats.filter((seat)=>seat !== seatId) : [...(Array.isArray(prevSeats) ? prevSeats : []),seatId]);
  }



  const groupRows = [["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]];


  return (
    show ? (
     <div className="flex flex-col md:flex-row commonLayoutSpacing 
     commonTopBottomPadding  min-h-screen 
     ">


      {/*AVAILABLE TIMING START */}
      {
        date && (
          <AvailableTiming
          availableTimingsData={show.dateTime[date] || []}
          selectedtime={selectedtime}
          setSelectedTime={setSelectedTime}
          />
        )
      }
      {/*AVAILABLE TIMING END */}

      

      <div className="w-full flex flex-col items-center justify-start gap-0 h-max" >

    {/*SELECT SEAT LAYOUT START */}
      <SelectSeatLayout
      groupRows={groupRows}
      handleSeatclick={handleSeatClick}
      selectedSeats={selectedSeats || []}
      />
      {/*SELECT SEAT LAYOUT END */}


      {/*CHECKOUT BUTTON START */}
        <button 
        onClick={()=>navigate('/my-bookings')}
        type="button"
        className="flex items-center mt-20 gap-1 px-10 py-3 text-sm bg-primary hover:bg-primary-dull
         transition rounded-full font-medium cursor-pointer active:scale-95 text-white"
         >
            Proceed To checkout
            <ArrowRightIcon 
            strokeWidth={3}
            className="w-4 h-4 "/>
        </button>
      {/*CHECKOUT BUTTON END */}


      </div>
    </div>
    
    ):(
    <Loading/>
    )
    
  )
}

export default SeatLayoutPage;