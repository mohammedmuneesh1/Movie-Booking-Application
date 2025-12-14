import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { dummyBookingData } from "../../assets/assets";
import AdminTitle from "../../components/(admin)/AdminTitle";
import { isoDateTimeFormatForCountry } from "../../lib/isoTimeFormat";


const AdminListBookingsPage = ()=>{
    const currency = import.meta.env.VITE_CURRENCY;
    //eslint-disable-next-line
    const [bookings,setBookings] = useState<any[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);


    const getAllBookings = async ()=>{
        setBookings(dummyBookingData);
        setIsLoading(false);
    }

    useEffect(()=>{
        getAllBookings();
    },[]);

    if(isLoading) return <Loading/>;


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


            </table>
        </div>
        </div>
    )
}

export default AdminListBookingsPage;