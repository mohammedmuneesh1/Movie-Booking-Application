

interface MovieCastInterface{
    //eslint-disable-next-line
    castData:Array<any>;
}

const MovieCast:React.FC<MovieCastInterface> = ({castData})=>{
    return(
        castData ? (
        <div className="text-white">
            <p
            className="text-lg font-medium mt-20"
            >
                Your Favourite Cast
            </p>
            <div className="overflow-x-auto no-scrollbar mt-8 pb-4 " >
                <div className="flex items-center gap-4 w-max px-4 ">

               {
                castData?.slice(0,12).map(
                    //eslint-disable-next-line
                    (cast:any,index:number)=>(
                        <div key={index}
                        className="flex flex-col cursor-pointer items-center text-center gap-3"
                        >
                            <img 
                            src={cast?.profile_path}
                            alt=""
                            className="rounded-full h-20 md:h-20 aspect-square object-cover"
                            />
                     <p className="font-medium text-xs">{cast?.name ?? ""}</p>
                        </div>
                    ))
               }

                </div>
            </div>
        </div>
        ): null)
}

export default MovieCast