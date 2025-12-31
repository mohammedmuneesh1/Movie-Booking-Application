import React from 'react'
import { Outlet } from 'react-router-dom'
import ClientSideBar from '../components/(client)/ClientSideBar'
import ClientNavBar from '../components/(client)/ClientNavBar'

const UserSideLayout = () => {
  return (
       <section>
      <ClientNavBar/>
      <div className="flex">
      <ClientSideBar/>
      <main
       className="flex-1 px-4 py-10 md:px-10
        h-[calc(100vh-64px)] overflow-y-auto"
       >
        <Outlet /> {/* 👈 renders child route content */}
      </main>
      </div>
    </section>
  )
}

export default UserSideLayout;