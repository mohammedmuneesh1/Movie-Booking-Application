import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DateTimeMapInterface, MovieItemInterface, ShowTimeInterface } from "../types/MovieType";
import Loading from "../components/Loading";
import AvailableTiming from "../components/seatLayouPage-components/AvailableTimings";
import SelectSeatLayout from "../components/seatLayouPage-components/SelectSeatLayout";
import toast from "react-hot-toast";
import { ArrowRightIcon } from "lucide-react";
import axiosInstance from "../configs/axios";

const  SeatLayoutPage = () => {

  const {id,date}  = useParams();

  const [selectedSeats,setSelectedSeats] = useState<null | Array<string> >([]);
  const [occupiedSeats,setOccupiedSeats] = useState<null | Array<string> >([]);
  const [selectedtime,setSelectedTime] = useState<null | ShowTimeInterface>(null);
  const [checkoutLoading,setCheckoutLoading] = useState<boolean>(false);


  const [loading,setLoading] = useState<boolean>(true);

  const [show,setShow] = useState<null | {
    movie:MovieItemInterface,
    dateTime:DateTimeMapInterface,
  }>(null);

  const navigate = useNavigate();


  const getShow = async ()=>{



    try {

      if(!id || !date || typeof date === 'undefined') return navigate(-1);
      const res = await axiosInstance.get(`/api/show/${id}`);

      if(res?.data?.success){
        setShow({
          movie:res?.data?.data?.movieData,
          dateTime:res?.data?.data?.dateTime,
        })
      }

      
    } catch (error) {
       console.error(`Error while fetching movie seats`,error instanceof Error ?error.message:error);
       return toast.error("Technical Issue in fetching movie details. Please try again later.");
      
    }
    finally{
      setLoading(false);
    }



  }



  //getting occupied seats data from showmodal.
  const getOccupiedSeats = async ()=>{
    try {
      if(!selectedtime) return;
      // if(!selectedtime) return toast.error("Please choose movie timing");
      const res = await axiosInstance.get(`/api/bookings/seats/${selectedtime.showId}`);
      console.log('res data ',res?.data?.data);
      if(res?.data?.success){
        setOccupiedSeats(res?.data?.data);
      }
      else{
        return toast.error(res?.data?.response ?? "Technical Issue in checking seats. Please try again later.");
      }
    } catch (error) {
      console.error(`Error while fetching movie seats`,error instanceof Error ?error.message:error);
      return toast.error("Technical Issue in checking seats. Please try again later.");
    }
  }



  useEffect(()=>{
    getShow();
  },[]);


  useEffect(()=>{
    getOccupiedSeats();
  },[selectedtime])





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
    
        if(occupiedSeats?.includes(seatId)){
          return toast.error("This seat is already booked. Please choose another seats.");
        }
        
    setSelectedSeats((prevSeats)=>( Array.isArray(prevSeats) && prevSeats.includes(seatId)) ? prevSeats.filter((seat)=>seat !== seatId) : [...(Array.isArray(prevSeats) ? prevSeats : []),seatId]);
  }



  const bookTickets = async ()=>{
    try {
      const token = localStorage.getItem("token");
      if(!token) return navigate("/login");
      if(!selectedtime) return toast.error("Please choose movie timing");
      if(!selectedSeats || !selectedSeats.length) return toast.error("Please select at least one seat");
      setCheckoutLoading(true);
      const res = await axiosInstance.post('/api/bookings/create',{
        showId:selectedtime.showId,
        selectedSeats:selectedSeats,
      });
      if(res?.data?.success){

        // toast.success("Tickets has been successfully reserved. Please proceed to checkout.");
        // return navigate('/user/dashboard/bookings')

         window.location.href=res?.data?.data?.url;




      }
      else{
        return toast.error(res?.data?.response ?? "Technical Issue in booking tickets. Please try again later.");
      }
      
    } catch (error) {
       console.error("error FS",error instanceof Error ? error.message : error);
       return toast.error(" Technical Issue in booking tickets.Please refresh the page and try again later...");
    }
    finally{
      setCheckoutLoading(false);
      
    }
  }



  const groupRows = [["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]];


  if(loading) return <Loading />


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
          setSelectedTime={(val:ShowTimeInterface)=>{
            if(selectedtime !== null  &&  JSON.stringify(val) === JSON.stringify(selectedtime) ){
              setSelectedTime(val);
            }
            else{
              setSelectedSeats(null);
              setSelectedTime(val);
            }
          } 
        }
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
      occupiedSeats={occupiedSeats || []}
      />
      {/*SELECT SEAT LAYOUT END */}


      {/*CHECKOUT BUTTON START */}
        <button 
        // onClick={()=>navigate('/my-bookings')}
        onClick={()=>bookTickets()}
        type="button"
        className="flex items-center mt-20 gap-1 px-10 py-3 text-sm bg-primary hover:bg-primary-dull
         transition rounded-full font-medium cursor-pointer active:scale-95 text-white capitalize"
         >
          {
            checkoutLoading ?(
              "Proceeding Checkout..."
            ):(
              "Proceed To checkout"
            )
          }
            
            <ArrowRightIcon 
            strokeWidth={3}
            className="w-4 h-4 "/>
        </button>
      {/*CHECKOUT BUTTON END */}


      </div>
    </div>
    
    ):(
<div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
    🎟️
  </div>

  <h3 className="text-lg font-semibold text-slate-100">
    We’re having trouble loading the seat layout
  </h3>

  <p className="mt-2 max-w-sm text-sm text-gray-400 leading-relaxed">
    Something went wrong while fetching the seat information for this show.
    Please refresh the page and try again.  
    If the problem continues, contact us at{" "}
    <span className="text-primary font-medium">
      support@quickshow.com
    </span>.
  </p>
</div>
    )
    
  )
}

export default SeatLayoutPage;