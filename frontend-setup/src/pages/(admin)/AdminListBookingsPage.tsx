import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { dummyBookingData } from "../../assets/assets";
import AdminTitle from "../../components/(admin)/AdminTitle";
import { isoDateTimeFormatForCountry } from "../../lib/isoTimeFormat";
import toast from "react-hot-toast";
import axiosInstance from "../../configs/axios";


const AdminListBookingsPage = ()=>{
    const currency = import.meta.env.VITE_CURRENCY;
    //eslint-disable-next-line
    const [bookings,setBookings] = useState<any[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);


    const getAllBookings = async ()=>{
        setBookings(dummyBookingData);
        try {
            const res = await axiosInstance.get('/api/bookings/all/bookings');
            setIsLoading(false);
            if(res?.data?.success === true) {
                return setBookings(res?.data?.data);
            } 
            else{
                return toast.error(res?.data?.response ?? "Technical Issue in fetching user bookings. Please try again later.");
            }
        } catch (error) {
            setIsLoading(false);
            console.error("error FS",error instanceof Error ? error.message : error);
                toast.error("Technical Issue in fetching user bookings. Please try again later.");
        }


        setIsLoading(false);
    }

    useEffect(()=>{
        getAllBookings();
    },[]);

    if(isLoading){
         return <Loading/>;
        };


    return(
        <div className="max-w-full w-full overflow-hidden text-white">
        <AdminTitle 
        firstTitle="List"
        secondTitle="Bookings"
        />
        <div 
        className="mt-6 max-w-full w-full overflow-x-auto"
        >
            <table 
            className="w-full border-collapse rounded-md overflow-hidden text-nowrap"
            >
                            <thead>
                        <tr className="bg-primary/20 text-left text-white">
                        <th className="p-2 font-medium pl-5">User Name</th>
                        <th className="p-2 font-medium ">Movie Name</th>
                        <th className="p-2 font-medium ">Show Time</th>
                        <th className="p-2 font-medium ">Seats</th>
                        <th className="p-2 font-medium ">Amount</th>
                        </tr>
                    </thead>


                        {
                            bookings && bookings?.length > 0 ?(
                                
                                <tbody className="text-sm font-light">
                                            {
                                                bookings?.map((bookingItem,index:number)=>(
                                                    <tr 
                                                    key={index}
                                                    className="border-b
                                                     border-primary/10
                                                      bg-primary/5
                                                       even:bg-primary/10"
                                                    >
                                                        <td className="p-2 min-w-45 pl-5">{bookingItem?.user?.name}</td>
                                                        <td className="p-2">{bookingItem?.show?.movie?.title}</td>
                                                        <td className="p-2">{isoDateTimeFormatForCountry(bookingItem?.show?.showDateTime)}</td>
                                                        <td className="p-2"> {Object.keys(bookingItem.bookedSeats).map((seat)=> bookingItem.bookedSeats[seat] ).join(', ')}</td>
                                                        <td className="p-2">{currency}{bookingItem?.amount}</td>
                                                        
                                                        {/* <td className="p-2"> {Object.keys(show.occupiedSeats).length}</td> */}
                    
                    
                    
                                                    </tr>
                    
                                                ))
                                            }
                    
                                        </tbody>
                            ):(
                                <tbody className="text-sm font-light">
                                         
                                                    <tr 
                                                    
                                                    className="border-b
                                                     border-primary/10
                                                      bg-primary/5
                                                       even:bg-primary/10"
                                                    >
                                                 <td colSpan={5} className="p-2 w-full max-w-full text-center pl-5">No Booking Founds</td>

                                                </tr>
                                        </tbody>
                                
                            )
                        }


            </table>
        </div>
        </div>
    )
}

export default AdminListBookingsPage;