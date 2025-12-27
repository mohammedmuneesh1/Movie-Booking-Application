import  { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {assets} from '../assets/assets';
import { MenuIcon, SearchIcon, User, XIcon } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
//eslint-disable-next-line
// import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const  Navbar = () => {
  
  const [isOpen,setIsOpen] = useState<boolean>(false);
  const {userInfo} = useAppContext();
  //eslint-disable-next-line
  // const {user} = useUser();
  //eslint-disable-next-line
  // const {openSignIn} = useClerk();

  const navigate = useNavigate();



  const handleNavBar = useCallback((value:boolean)=>{
  setIsOpen(value);
  },[]);

  const scrollToFn = useCallback(()=>{
    scrollTo(0,0);
    setIsOpen(false)
  },[]);
  

  return (
    <header
        className='fixed  top-0 left-0 
    z-50 w-full flex items-center
    justify-between 
    commonLayoutSpacing
    py-5 '
    >


{/*APP-LOGO SECTION START */}

    <div
    className='max-md:flex-1 '
>
   <Link 
   to="/"
   
   //  {/*CHECK DOCUMENTATION FOLDER FOR MAX-MD:FLEX-1 */}
   >
    <img
    src={assets.logo}
    alt='app-logo'
    className='max-w-36 w-full h-auto'
    />
   </Link>
    </div>
{/*APP-LOGO SECTION START */}


{/*MENU SECTION START */}
<div
className={`max-md:absolute
 max-md:top-0 max-md:left-0 max-md:font-medium 
max-md:text-lg z-50 flex flex-col md:flex-row
 items-center 
 max-md:justify-center
 gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70
  md:bg-white/10 md:border border-gray-300/20 overflow-hidden 
  transition-[width]
  duration-300
  text-white
  ${isOpen ? 'max-md:w-full':'max-md:w-0'}
`}
>

  <XIcon
   className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white'
   onClick={()=>handleNavBar(false)}
  />
  <Link
  onClick={scrollToFn}
  to={"/"}
  >Home</Link>
  <Link 
  onClick={scrollToFn}
  to={"/movies"}>Movies</Link>
  <Link
  onClick={scrollToFn}
  to={"/"}>Theaters</Link>
  <Link 
  onClick={scrollToFn}
  to={"/"}>Releases</Link>
  <Link 
  onClick={scrollToFn}
  to={"/favourites"}>Favorites</Link>
</div>

{/*
      <Route path="/movies/:id" element={<MovieDetailsPage/>}/>
      <Route path="/movies/:id/:date" element={<SeatLayoutPage/>}/>
      <Route path="/my-bookings" element={<MyBookingsPage/>}/>
      <Route path="/favourite" element={<FavouritePage/>}/>
    </Routes>
    {!isAdminRoute && <Footer/>} */}



{/*MENU SECTION END */}



{/*SEARCH + LOGIN BUTTON START */}
<div className='flex items-center  gap-4 md:gap-6'>
  <SearchIcon
  className='max-md:hidden w-6 h-6 cursor-pointer text-white'
  />
  {
    !userInfo ? (
      <button
      onClick={() => navigate("/login")}
      // onClick={() => openSignIn()}
      className='px-4 py-1 sm:px-7 sm:py-2 bg-primary
      hover:bg-primary-dull transition-all  text-sm
      rounded-full font-medium cursor-pointer text-white
      '>
      Login
      </button>

    ):(

      
        <button
      onClick={() => userInfo?.ia  ?  navigate('/admin') : navigate("/user/bookings")}
      className='px-4 py-1 sm:px-7 sm:py-2 bg-primary
      hover:bg-primary-dull transition-all  text-sm
      rounded-full font-medium cursor-pointer text-white
       flex items-center gap-2'>
        <User />
      </button>
      // <UserButton/>
    )
  }
  {/* <button
  className='px-4 py-1 sm:px-7 sm:py-2
    bg-primary 
    hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-white hover:text-gray-100'
  >
    Login
  </button> */}
</div>
{/*SEARCH + LOGIN BUTTON END */}



{/*SIDE MENU  START */}
<MenuIcon
onClick={()=>handleNavBar(true)}
className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white'
/>
{/*SIDE MENU  END */}

    </header>
  )
}

export default Navbar;