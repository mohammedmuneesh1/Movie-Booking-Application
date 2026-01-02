
import { jwtDecode } from 'jwt-decode';
import { assets } from '../../assets/assets'
import { LayoutDashboardIcon, ListCollapseIcon, PlusSquareIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ClientSideBar = () => {



  const  user = {
      firstName:'',
      lastName:'',
      imageUrl:assets.profile,
  };

  const token = localStorage.getItem('token');

  if(token &&  jwtDecode(token)){
    //eslint-disable-next-line
    const tokenDecoded: any| null = token ?  jwtDecode(token) : null;

    if(tokenDecoded.name ){
      user.firstName = tokenDecoded?.name ?? "";
    }

  }


    const clientNavLinks = [
        {name:"Dashboard", path:'/user/dashboard', icon:LayoutDashboardIcon},
        {name:"Profile", path:'/user/dashboard/profile', icon:LayoutDashboardIcon},
        {name:"Saved Movies", path:'/user/dashboard/saved-movies', icon:PlusSquareIcon},
        // {name:"List Shows", path:'/admin/list-shows', icon:ListCollapseIcon},
        {name:"List Bookings", path:'/user/dashboard/bookings', icon:ListCollapseIcon},
    ];
    
    
  return (
    <div
    className='text-white bg-primary/6 h-[calc(100vh-64px)] max-w-13 md:max-w-60 
    w-full border-r border-gray-300/20 text-sm
    md:flex flex-col items-center 
    pt-8 
    ' >

        {/*USER PROFILE IMAGE START */}
        <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' 
        src={user.imageUrl}
         alt="user image"
         loading="lazy"
          />
        {/*USER PROFILE IMAGE END */}

        <h3 className='mt-2 text-base md:block hidden'>{user.firstName ?? ""}{user.lastName ?? ""}</h3>

        <div className='w-full'>
            {clientNavLinks?.map((val)=>(
                <NavLink 
                  end
                 key={val.path}
                  to={val.path} 
                 className={({isActive }) => `relative
                  flex items-center
                  max-md:justify-center
                  gap-2 w-full py-2.5 md:pl-10
                  first:mt-6 text-gray-400 ${isActive && `bg-primary/15 text-primary group`}
                  `}
                >
               {({ isActive }) => (
      <>
        <val.icon className="w-6 h-6" />
        <span className="md:block hidden">{val.name}</span>
        <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary'}`}>


        </span>
      </>
    )}

                </NavLink>
            ))}

        </div>




        </div>
  )
}

export default ClientSideBar;