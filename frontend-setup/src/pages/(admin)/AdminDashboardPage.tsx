import { useEffect, useState } from "react";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/Loading";
import AdminTitle from "../../components/(admin)/AdminTitle";
import DashboardStatisticsCard from "../../components/(admin)/dashboard-page/DashboardStatisticsCard";
import { ChartLineIcon, CircleDollarSignIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";
import ActiveMovieCard from "../../components/(admin)/dashboard-page/ActiveMovieCard";


const AdminDashboardPage = ()=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const [loading,setLoading] = useState(true);
    const [dashboardData,setDashboardData] = useState({
        totalBookings:0,
        totalRevenue:0,
        activeShows:[],
        totalUser:0,
    })



    const fetchDashboardData =async()=>{
        //eslint-disable-next-line
        setDashboardData(dummyDashboardData as any);

        setLoading(false);
    }

    useEffect(()=>{
        fetchDashboardData();
    },[]);


    const dashboardCards = [
        {title:"Total Bookings", value:dashboardData.totalBookings || 0, icon:ChartLineIcon},
        {title:"Total Revenue", value: currency + dashboardData.totalRevenue || 0, icon:CircleDollarSignIcon},
        {
            title:"Active Shows", value:dashboardData.activeShows.length || 0, icon:CircleDollarSignIcon},
        {title:"Total Users", value:dashboardData.totalUser || 0, icon:CircleDollarSignIcon},


    ]


    if(loading) return <Loading/>;


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

                    <div
             className="relative w-full max-w-full 
              grid md:grid-cols-4  xs:grid-cols-2 grid-cols-1 gap-4 mt-6 ">

                {
                    dashboardData?.activeShows?.map((card,index:number)=>(
                        <ActiveMovieCard
                        key={index}
                        data={card}
                        />  
                    ))
                }
                </div>

                {/*ACTIVE MOVIES GRID END HERE  */}


            </div>
            {/*ACTIVE MOVIE SECTION END */}
        </div>
    )
}

export default AdminDashboardPage;