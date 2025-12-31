import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import AdminTitle from "../../components/(admin)/AdminTitle";
import { isoDateTimeFormatForCountry } from "../../lib/isoTimeFormat";
import axiosInstance from "../../configs/axios";
import toast from "react-hot-toast";




const AdminListShowsPage = ()=>{

    //eslint-disable-next-line
    const [shows,setShows] = useState<any[]>([]);

    const [loading,setLoading] = useState(true);

    // const getAllShows = async ()=>{
    //     setShows([
    //         {
    //             movie:dummyShowsData[0],
    //             showDateTime:'2025-06-30T02:30:00.000Z',
    //             showPrice:59,
    //             occupiedSeats:{
    //                 A1:'user_1',
    //                 B1:'user_2',
    //                 C1:'user_3'
    //             }
    //         }
    //     ]);
    //     setLoading(false);
    // };

       const getAllShows = async ()=>{
        try {

            const res = await axiosInstance.get('/api/show/all');
            setLoading(false);

            if(res?.data?.success === true) {
                return  setShows(res?.data?.data?.shows);
            } 
            else{
                return toast.error(res?.data?.response ?? "Technical Issue in fetching user bookings. Please try again later.");
            }
        } catch (error) {
            setLoading(false);
            console.error("error FS",error instanceof Error ? error.message : error);
                toast.error("Technical Issue in fetching user bookings. Please try again later.");
        }


        setLoading(false);
    }

    useEffect(()=>{
        getAllShows();
    },[]);


    const currency = import.meta.env.VITE_CURRENCY



    if(loading) return <Loading/>




    return(
        <section className="text-white w-full max-w-full ">
            <AdminTitle
            firstTitle="List"
            secondTitle="Shows"
             />

             <div className="mt-6 max-w-full w-full overflow-x-auto ">
                <table 
                className="w-full border-collapse rounded-md overflow-hidden text-nowrap"
                >
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                        <th className="p-2 font-medium pl-5">Movie Name</th>
                        <th className="p-2 font-medium ">Show Time</th>
                        <th className="p-2 font-medium ">Total Bookings</th>
                        <th className="p-2 font-medium ">Earnings</th>
                        </tr>
                    </thead>

                    {
                        shows && shows?.length > 0 ? (

                    <tbody className="text-sm font-light">
                        {
                            shows?.map((show,index:number)=>(
                                <tr 
                                key={index}
                                className="border-b
                                 border-primary/10
                                  bg-primary/5
                                   even:bg-primary/10"
                                >
                                    <td className="p-2 min-w-45 pl-5">{show?.movieRef.title}</td>
                                    {/* <td className="p-2">{isoDateTimeFormatForCountry('2025-06-30T02:30:00.000Z')}</td> */}
                                    <td className="p-2">{isoDateTimeFormatForCountry(show?.showDateTime ?? "")}</td>
                                    <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                                    <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
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
                                    <td 
                                    colSpan={5}
                                    className=" p-2 w-full max-w-full pl-5 text-center">No Shows Found</td>
                                    {/* <td className="p-2"> {Object.keys(show.occupiedSeats).length}</td> */}
                                </tr>
                    </tbody>
                        )
                    }

                    


                </table>

             </div>

        </section>
    )
}

export default AdminListShowsPage;