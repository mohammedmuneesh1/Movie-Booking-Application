import React, { useState } from "react";
import { Edit3, Mail, Phone, MapPin, Calendar, X } from "lucide-react";

const UserProfilePage = () => {

    const [isEditOpen, setIsEditOpen] = useState(false);



  // mock data (replace with API data)
  const user = {
    name: "Virtual Reality Messenger",
    email: "vrmessenger@email.com",
    phone: "+91 98765 43210",
    location: "Kerala, India",
    joinedAt: "2024-08-12",
    avatar:
      "https://ui-avatars.com/api/?name=Virtual+Reality+Messenger&background=111827&color=fff",
  };

  return (
    <div className="min-h-screen text-white p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>

        <button
        type="button"
        onClick={() => setIsEditOpen(true)}
        className="flex items-center gap-2 px-4 py-2
         text-sm bg-primary hover:bg-primary-dull transition rounded-md cursor-pointer
         ">
          <Edit3
          className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div
       className="bg-neutral-900 border border-neutral-800 hover:border-primary transition ease-in-out duration-300 rounded-xl p-6 flex flex-col md:flex-row gap-6"
    
       >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar}
            alt="user avatar"
            loading="lazy"
            className="w-28 h-28 rounded-full object-cover border-2 border-primary"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
          <p className="text-gray-400 mb-4">Movie Ticket Enthusiast 🎬</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 text-primary" />
              {user.email}
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="w-4 h-4 text-primary" />
              {user.phone}
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-primary" />
              {user.location}
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-primary" />
              Joined on {new Date(user.joinedAt).toDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Extra Section (optional but smart) */}
      <div
       className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
         className="bg-neutral-900 border border-neutral-800 hover:border-primary transition ease-in-out duration-300 rounded-xl p-4"
         >
          <p className="text-gray-400 text-sm">Total Bookings</p>
          <p className="text-2xl font-semibold mt-1">12</p>
        </div>

        <div
         className="bg-neutral-900 border border-neutral-800 hover:border-primary transition ease-in-out duration-300 rounded-xl p-4"
         >
          <p className="text-gray-400 text-sm">Favourite Movies</p>
          <p className="text-2xl font-semibold mt-1">8</p>
        </div>

        <div
         className="bg-neutral-900 border border-neutral-800 hover:border-primary transition ease-in-out duration-300 rounded-xl p-4"
         >
          <p className="text-gray-400 text-sm">Upcoming Shows</p>
          <p className="text-2xl font-semibold mt-1">2</p>
        </div>
      </div>

      <EditProfileModal
  open={isEditOpen}
  onClose={() => setIsEditOpen(false)}
/>


    </div>
  );
};

export default UserProfilePage;



interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
}) => {
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  if (!open) return null;

  // 📍 Get location via browser GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // ⚠️ TEMP: show lat/lng
        // In production, reverse-geocode this
        setLocation(`Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`);

        setLoadingLocation(false);
      },
      () => {
        alert("Unable to fetch location");
        setLoadingLocation(false);
      }
    );
  };

  const handleSave = () => {
    // TODO: API call
    // console.log({ phone, location });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      {/* backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 w-[90%] max-w-md bg-gray-900 text-white rounded-xl p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* phone */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-1 block">
            Phone Number
          </label>
          <div className="flex items-center gap-2 bg-gray-800 rounded-md px-3">
            <Phone className="w-4 h-4 text-primary" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="bg-transparent w-full py-2 outline-none"
            />
          </div>
        </div>

        {/* location */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-1 block">
            Location
          </label>
          <div className="flex items-center gap-2 bg-gray-800 rounded-md px-3">
            <MapPin className="w-4 h-4 text-primary" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your location"
              className="bg-transparent w-full py-2 outline-none"
            />
          </div>

          <button
            onClick={handleDetectLocation}
            className="mt-2 text-xs text-primary hover:underline"
          >
            {loadingLocation ? "Detecting location..." : "Use current location"}
          </button>
        </div>

        {/* 🔐 FUTURE: Change Password */}
        {/*
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-1 block">
            Change Password
          </label>
          <input
            type="password"
            placeholder="New password"
            className="w-full bg-gray-800 rounded-md px-3 py-2 outline-none"
          />
        </div>
        */}

        {/* 🌍 FUTURE: Google Maps picker */}
        {/*
        - Integrate Google Maps JS SDK
        - Show draggable marker
        - Reverse-geocode lat/lng to city, state
        - Save structured address instead of string
        */}

        {/* actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-primary hover:bg-primary-dull rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

