import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import SeatLayoutPage from './pages/SeatLayoutPage'
import MyBookingsPage from './pages/MyBookingsPage'
import FavouritePage from './pages/FavouritePage'

import MainLayout from './layout/ClientSideLayout'
import ScrollToTop from './lib/ScrollToTop'
import AdminSideLayout from './layout/AdminSideLayout'
import AdminAddShowsPage from './pages/(admin)/AdminAddShowsPage'
import AdminListBookingsPage from './pages/(admin)/AdminListBookingsPage'
import AdminDashboardPage from './pages/(admin)/AdminDashboardPage'
import AdminListShowsPage from './pages/(admin)/AdminListShowsPage'
import AdminMiddleware from './middleware/AdminMiddleware'
import AdminLoginPage from './components/(admin)/AdminLogin'
import NotFoundPage from './components/NotFoundPage'
import UserSideLayout from './layout/UserSideLayout'
import ClientDashboardPage from './components/(client)/ClientDashboardPage'
import UserProfilePage from './pages/(client)/UserProfilepage'
import UserSavedMoviesPage from './pages/(client)/userSavedMoviesPage'
import LoadingPage from './components/LoadingPage'



function App() {
  // const isAdminRoute = useLocation().pathname.startsWith('/admin');


  return(
    <>
       <ScrollToTop />

        <Routes>
      {/* Public routes with header/footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/movies/:id/:date" element={<SeatLayoutPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        {/* <Route path="/my-bookings" element={<MyBookingsPage />} /> */}
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/login" element={<AdminLoginPage/>} />
      </Route>


      {/*⚠️⚠️ ANOTHER WAY IS    <Route path="/admin/*" element={<FavouritePage />} > </Route>  */}

      {/*ADMIN ROUTE START */}
      
<Route path="/admin" element={<AdminMiddleware />}>
  <Route element={<AdminSideLayout />}>
    <Route index element={<AdminDashboardPage />} />
    <Route path="list-shows" element={<AdminListShowsPage />} />
    <Route path="add-shows" element={<AdminAddShowsPage />} />
    <Route path="list-bookings" element={<AdminListBookingsPage />} />
  </Route>
</Route>

{/* <Route path="/user/dashboard" element={<AdminMiddleware />}> */}
<Route path="/user/dashboard" element={<UserSideLayout />}>
    <Route index element={<ClientDashboardPage />} />
   <Route path="bookings" element={<MyBookingsPage />} />
   <Route path="profile" element={<UserProfilePage />} />
   <Route path="saved-movies" element={<UserSavedMoviesPage />} />
</Route>


{/* <Route path="/user/dashboard" element={<UserSideLayout />}>
  <Route index element={<ClientDashboardPage />} />
  <Route path="bookings" element={<AdminListShowsPage />} />
</Route> */}



<Route path="*" element={<NotFoundPage />} />
{/* ✔️ This allows URLs like:
/admin → loads default layout content
/admin/dashboard
/admin/add-shows
/admin/list-bookings */}

      {/*ADMIN ROUTE END */}





      {/* Admin route without layout */}
      {/* <Route path="/admin/*" element={<AdminPage />} /> */}
    </Routes>

    </>
  )
}
 
export default App


