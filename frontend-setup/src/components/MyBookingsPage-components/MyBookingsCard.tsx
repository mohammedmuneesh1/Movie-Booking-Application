import { isoDateTimeFormatForCountry } from "../../lib/isoTimeFormat";
import { timeFormat } from "../../lib/timeFormat";



interface MyBookingsCardInterface{
//eslint-disable-next-line
    data:any
}
const MyBookingsCard:React.FC<MyBookingsCardInterface> = ({data})=>{

      const currency = import.meta.env.VITE_CURRENCY;

    return(
        <div
           className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-full w-full"
          > 


          
    {/* IMAGE WITH TITLE +RUN-TIME+ DATE_TIME START */}

          <div className="flex flex-col md:flex-row">
          <img 
          src={data?.show.movie.poster_path}
        alt="movie poster"
        // className="h-40 w-40 object-cover rounded-lg" 
        className="md:max-w-45 w-full h-auto aspect-video object-cover object-bottom rounded "
        />

        <div className="flex flex-col p-4 ">
            <p className="text-lg font-semibold">{data?.show.movie.title}</p>
            <p className="text-sm text-gray-400">{timeFormat(data?.show.movie.runtime)}</p>
            <p className="text-sm text-gray-400 mt-auto">{isoDateTimeFormatForCountry(data?.show.showDateTime)}</p>

        </div>
         </div>

    {/* IMAGE WITH TITLE +RUN-TIME+ DATE_TIME END */}



    {/* PRICE + TOTAL TICKETS + SEAT NUMBER START */}

    <div className="flex flex-col md:items-end md:text-right justify-between p-4 gap-2" >

        {/* PRICE + PAY NOW BUTTON START */}  
         <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold mb-3">{currency} {data.amount}</p>
            {!data.isPaid && (
                <button className="btnCommonDesign text-sm rounded-full! ">
                Pay Now 
            </button>
        )}
        </div>
        {/* PRICE + PAY NOW BUTTON END */}  
        <div className="tex-sm leading-5 text-sm" >
            <p>
                <span 
                className="text-gray-400"
                >
                    Total Tickets: {data?.bookedSeats?.length}
                </span>
            </p>
            <p>
                <span 
                className="text-gray-400"
                >
                    Seats: {data?.bookedSeats?.join(", ")}
                </span>
            </p>
        </div>
    </div>
    {/* PRICE + TOTAL TICKETS + SEAT NUMBER END */}


















          </div>
    )
}
export default MyBookingsCard;