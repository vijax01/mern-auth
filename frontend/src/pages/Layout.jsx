import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const Layout = () => {
     return (
          <div className='w-full min-h-screen bg-gray-50' >
               <Navbar /> {/* visible on each page , always  same*/}
               <Outlet /> {/* variable content , defined in app.jsx routing . Vo page ya component dikhega jisse url match karega. Pages Load inside Outlet.*/}
          </div>
     )
}

export default Layout