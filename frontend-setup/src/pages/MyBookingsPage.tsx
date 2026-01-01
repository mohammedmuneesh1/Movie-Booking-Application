import { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import MyBookingsCard from "../components/MyBookingsPage-components/MyBookingsCard";
import toast from "react-hot-toast";
import axiosInstance from "../configs/axios";
import { Ticket } from "lucide-react";
import AdminTitle from "../components/(admin)/AdminTitle";


const  MyBookingsPage = () => {
  //eslint-disable-next-line
  const currency = import.meta.env.VITE_CURRENCY;
  //eslint-disable-next-line
  const [bookings,setBookings] = useState<any[]>([]);

  const [isLoading,setIsLoading] = useState(true);

  const getMyBookings = async ()=>{

    try {
      const res = await axiosInstance.get('/api/bookings/user/bookings');
      console.log('res',res?.data?.data);
      if(res?.data?.success){
        return setBookings(res?.data?.data);
      }
      else{
        return toast.error(res?.data?.response ?? "Technical Issue in fetching user bookings. Please try again later.");
      }
    } catch (error) {
      console.error("error FS",error instanceof Error ? error.message : error);
      return toast.error("Technical Issue in fetching user bookings. Please try again later.");
    }
    finally{
      setIsLoading(false);
    }
    setBookings(dummyBookingData);
    setIsLoading(false);
  }

  useEffect(()=>{
    getMyBookings();
  },[]);

  if(isLoading) return <Loading/>;

  return (
   <div className="relative  text-white
       min-h-screen">
        {/* <BlurCircle top="100px" left="100px"/> */}
        {/* <BlurCircle bottom="0px" left="600px"/> */}
        {/* <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div> */}

      {/* <h1 className="text-lg font-semibold mb-4"> My Bookings</h1> */}

      <AdminTitle 
      firstTitle="My"
      secondTitle="Bookings"
      firstTitleClass="text-white"
      />

      { (!bookings || bookings?.length === 0)  ? (
          <>
    <div className="flex flex-col items-center
     justify-center py-20 text-center">
  <div className="mb-4 flex h-16 w-16 items-center justify-center
   rounded-full bg-primary/10">
    <Ticket className="text-primary " />
  </div>

  <h3 className="text-lg font-semibold text-slate-100">
    No Bookings Found
  </h3>

  <p className="mt-2 max-w-sm text-sm text-gray-400">
    You haven&apos;t booked any movies yet.
  </p>
</div>
          </>

        ):(
          bookings.map((item,index:number)=>(
            <MyBookingsCard
            data={item}
            key={index}
            />
          ))
        )
      }




     </div> 
  )
}

export default MyBookingsPage;