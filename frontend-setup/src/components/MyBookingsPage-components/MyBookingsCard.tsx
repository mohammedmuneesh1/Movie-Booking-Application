import { Link } from "react-router-dom";
import { isoDateTimeFormatForCountry } from "../../lib/isoTimeFormat";
import { timeFormat } from "../../lib/timeFormat";
import { timeExpirationCheck } from "../../lib/timExpirationCheck";



interface MyBookingsCardInterface{
//eslint-disable-next-line
    data:any
}
const MyBookingsCard:React.FC<MyBookingsCardInterface> = ({data})=>{

      const currency = import.meta.env.VITE_CURRENCY;
      const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

      console.log('imge',data);


    return(
        <div
           className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-full w-full"
          > 


          
    {/* IMAGE WITH TITLE +RUN-TIME+ DATE_TIME START */}

          <div className="flex flex-col md:flex-row">
          <img 
          src={`${imageBaseUrl}${data?.show?.movieRef?.poster_path} `}
        alt="movie poster"
        // className="h-40 w-40 object-cover rounded-lg" 
        className="md:max-w-45 w-full h-auto aspect-video object-cover object-bottom rounded "
        />

        <div className="flex flex-col p-4 ">
            <p className="text-lg font-semibold">{data?.show.movieRef.title}</p>
            <p className="text-sm text-gray-400">{timeFormat(data?.show.movieRef.runtime)}</p>
            <p className="text-sm text-gray-400 mt-auto">{isoDateTimeFormatForCountry(data?.show.showDateTime)}</p>

        </div>
         </div>

    {/* IMAGE WITH TITLE +RUN-TIME+ DATE_TIME END */}



    {/* PRICE + TOTAL TICKETS + SEAT NUMBER START */}

    <div className="flex flex-col md:items-end md:text-right justify-between p-4 gap-2" >

        {/* PRICE + PAY NOW BUTTON START */}  
         <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold mb-3">{currency} {data?.paymentId?.amount }</p>

            {!data?.paymentId?.isPaid && (
                data?.paymentId?.paymentExpiresOn && !timeExpirationCheck(data?.paymentId?.paymentExpiresOn) ? (
                <Link
                to={data?.paymentId?.paymentLink}
                className="btnCommonDesign text-sm rounded-full! ">
                Pay Now 
            </Link>
                ):(
<div className="flex items-center gap-2 px-4 py-2
 rounded-full bg-red-500/10 text-primary border border-red-500/20">
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
     strokeLinecap="round"
      strokeLinejoin="round"
       d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
       />
  </svg>
  <span className="text-sm font-medium">Payment expired</span>
</div>


                ))}




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