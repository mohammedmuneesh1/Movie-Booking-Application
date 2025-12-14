import { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import MyBookingsCard from "../components/MyBookingsPage-components/MyBookingsCard";

const  MyBookingsPage = () => {
  //eslint-disable-next-line
  const currency = import.meta.env.VITE_CURRENCY;
  //eslint-disable-next-line
  const [bookings,setBookings] = useState<any[]>([]);

  const [isLoading,setIsLoading] = useState(true);

  const getMyBookings = async ()=>{
    setBookings(dummyBookingData);
    setIsLoading(false);
  }

  useEffect(()=>{
    getMyBookings();
  },[]);

  if(isLoading) return <Loading/>;

  return (
   <div className="relative commonLayoutSpacing text-white
     commonTopBottomPadding  min-h-screen">
        <BlurCircle top="100px" left="100px"/>
        {/* <BlurCircle bottom="0px" left="600px"/> */}
        <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>

      <h1 className="text-lg font-semibold mb-4"> My Bookings</h1>

      {
        bookings.map((item,index:number)=>(
          <MyBookingsCard
          data={item}
          key={index}
          />
        ))
      }




     </div> 
  )
}

export default MyBookingsPage;