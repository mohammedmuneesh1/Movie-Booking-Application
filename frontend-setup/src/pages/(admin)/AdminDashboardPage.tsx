import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import AdminTitle from "../../components/(admin)/AdminTitle";
import DashboardStatisticsCard from "../../components/(admin)/dashboard-page/DashboardStatisticsCard";
import { ChartLineIcon, CircleDollarSignIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";
import ActiveMovieCard from "../../components/(admin)/dashboard-page/ActiveMovieCard";
import axiosInstance from "../../configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/useAppContext";


const AdminDashboardPage = ()=>{

    const currency = import.meta.env.VITE_CURRENCY;
    const {tmdbImageUrl} = useAppContext();
    const [loading,setLoading] = useState(true);
    const [dashboardData,setDashboardData] = useState({
        totalBookings:0,
        totalRevenue:0,
        activeShows:[],
        totalUser:0,
    })



    const fetchDashboardData =async()=>{
        //eslint-disable-next-line
        // setDashboardData(dummyDashboardData as any);
        try {
            
            const res = await axiosInstance.get('/api/admin/dashboard');
            console.log('res',res?.data?.data?.activeShows);
            setLoading(false);
            if(res?.data?.success){
                setDashboardData(res?.data?.data);  
            }
            else{
                toast.error(res?.data?.response ?? "Technical Issue in fetching dashboard data. Please try again later.");
            }
        } catch (error) {
            console.error("error FD",error instanceof Error ? error.message : error);
            toast.error("Technical Issue in fetching dashboard data. Please try again later.");
            setLoading(false);
            
        }
    }

    useEffect(()=>{
        fetchDashboardData();
    },[]);




    const dashboardCards = [
        {title:"Total Bookings", value:dashboardData?.totalBookings || 0, icon:ChartLineIcon},
        {title:"Total Revenue", value: currency + dashboardData?.totalRevenue || 0, icon:CircleDollarSignIcon},
        {
            title:"Active Shows", value:dashboardData?.activeShows?.length || 0, icon:CircleDollarSignIcon},
        {title:"Total Users", value:dashboardData?.totalUser || 0, icon:CircleDollarSignIcon},
    ]


    if(loading) {
        return <Loading/>;
    }


    console.log('dashboardData?.activeShows',dashboardData?.activeShows);



    return(
        <div className="text-white w-full max-w-full">

            <AdminTitle
            firstTitle="Admin"
            secondTitle="Dashboard"
            />

            {/*GRID SECTION START */}
            <div
             className="relative w-full max-w-full overflow-hidden
              grid md:grid-cols-4  xs:grid-cols-2 grid-cols-1 gap-4 mt-6 ">

                <BlurCircle
                top="-150px"
                left="0"
                /> 


                {
                    dashboardCards?.map((card,index:number)=>(
                        <DashboardStatisticsCard
                        key={index}
                        data={card}
                        />
                    ))
                }
            </div>
            {/*GRID SECTION END */}


            {/*ACTIVE MOVIE SECTION START */}

            <div className=" max-w-full w-full mt-6">

                <h2 className="text-lg font-medium">Active Shows</h2>
            

            {/*ACTIVE MOVIES GRID START HERE  */}

            {
                dashboardData?.activeShows && dashboardData?.activeShows?.length > 0 ?(
               <div
  className="relative w-full max-w-full 
    grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5! gap-4 mt-6"
           
              // className="relative w-full max-w-full 
            //   grid md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5  xs:grid-cols-2 grid-cols-1 gap-4 mt-6 "
              
              
              >

                {
                    dashboardData?.activeShows?.map((card,index:number)=>(
                        <ActiveMovieCard
                        key={index}
                        data={card}
                        customSyle="!w-full "
                        imgStyle="!h-auto "
                        tmdbImageUrl={tmdbImageUrl}
                        />  
                    ))
                }
                </div>
                ):(
                    <h3 className="text-white text-lg font-medium">No Active Shows</h3>
                )
            }

                {/*ACTIVE MOVIES GRID END HERE  */}


            </div>
            {/*ACTIVE MOVIE SECTION END */}
        </div>
    )
}

export default AdminDashboardPage;