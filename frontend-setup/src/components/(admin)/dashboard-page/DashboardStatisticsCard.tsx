
import type { LucideIcon } from "lucide-react";

interface DashboardStatisticsCard{ 
  data:{
    title:string,
    value:number | string,
    icon:LucideIcon
    },  
} 
const DashboardStatisticsCard:React.FC<DashboardStatisticsCard> = ({data})=>{
    return(
        <div 
        className="p-4 h-30 bg-primary/10  border-primary/20  rounded-md  flex items-center justify-between gap-4 flex-wrap text-white ">

            <div className="flex-1">
                <h3 className="text-sm capitalize font-medium">{data?.title ?? ""}</h3>
                <h4 className="text-xl">{data?.value ?? ""}</h4>
            </div>

            <div className=" ">
                <data.icon className="w-8 h-8"/>
            </div>
        </div>
    )
};

export default DashboardStatisticsCard;