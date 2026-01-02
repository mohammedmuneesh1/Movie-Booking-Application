import { Link } from "react-router-dom";

const ClientDashboardPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-red-500">Movie Buff 🍿</span>
        </h1>
        <p className="text-gray-400 mt-1">
          Ready for your next show?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { title: "Tickets Booked", value: "12" },
          { title: "Upcoming Shows", value: "3" },
          { title: "Wallet Balance", value: "₹450" },
          { title: "Saved Movies", value: "8" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-red-500 transition"
          >
            <p className="text-sm text-gray-400">{item.title}</p>
            <p className="text-2xl font-semibold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Booking */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            🎟 Upcoming Booking
          </h2>

          <div className="flex flex-col sm:flex-row gap-5">
            <img
              src="https://image.tmdb.org/t/p/w500/5c5FRas3ySsaQ97uVdeFKIl83TT.jpg"
              alt="movie poster"
              loading="lazy"
              className="w-32 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                Sarvam Maya
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                25 Dec 2025 • 7:30 PM
              </p>
              <p className="text-gray-400 text-sm">
                Screen 3 • Seat G7, G8
              </p>

              <button className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition">
                View Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            ⚡ Quick Actions
          </h2>

          <div
           className="flex 
           sm:flex-row
            flex-col gap-2"
           >
            {quickActionsArr.map((action, i) => (
              <Link
                to={action.link}
                key={i}
                className="w-fit text-left px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition text-sm"
              >
                {action?.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;



const quickActionsArr = [
    {
        id:1,
        title:'Browse Movies',
        link:'/movies',
    },{
        id:2,
        title:'My Bookings',
        link:'/user/dashboard/bookings',
    },
    // {
    //     id:3,
    //     title:'Wallet & Offers',
    //     link:'/user/dashboard/wallet',

    // }
    {
        id:4,
        title:'Profile Settings',
        link:'/user/dashboard/profile',
    }


]