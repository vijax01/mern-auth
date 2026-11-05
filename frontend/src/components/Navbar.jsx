import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';


const Navbar = () => {


     const { user, setUser } = useAuth();
     const navigate = useNavigate();


     const handleVerifyEmail = async () => {
          try {
               const res = await api.post('/auth/send-verify-otp');
               if (res.data.success) {
                    navigate('/email-verify');
               }
          } catch (error) {
               // no need toast here (already handled)
          }
     };


     const handleLogout = async () => {
          await api.post("/auth/logout");
          navigate('/');
          setUser(null);
     };


     return (
          <div className='w-full fixed z-5 h-16 px-4 md:px-30 flex items-center justify-between'>
               <h1 className='text-2xl font-light flex items-center '>
                    <Link to="/">auth</Link>
                    <img className='h-6 ml-1' src="/favicon.png" alt="logo" />
               </h1>
               {!user ? (
                    <Link to="/auth">
                         <h1 className='flex items-center gap-1 text-md px-4 py-1 border border-slate-500 rounded-2xl hover:bg-gray-200/70 cursor-pointer'>
                              Get Started
                              <ArrowRight size={16} />
                         </h1>
                    </Link>
               ) : (
                    <div className='flex gap-2' >
                         <div className='group relative cursor-pointer' >

                              <p className='relative overflow-hidden h-7 w-7 rounded-full bg-linear-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center  text-white text-sm' >
                                   {user?.username[0].toUpperCase()}
                                   <span
                                        className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-400 ease-out bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg]"
                                   />
                              </p>

                              <div className='hidden group-hover:block absolute top-full right-0 p-2 pr-0' >
                                   <div className=' w-max min-w-28 p-2 text-center rounded-sm bg-gray-200'>
                                        {!user?.isAccountVerified && (
                                             <p onClick={handleVerifyEmail} className='text-sm flex items-center justify-center px-4 py-1 h-7 hover:bg-gray-300 cursor-pointer'>
                                                  Verify Email
                                             </p>
                                        )}
                                        <p onClick={handleLogout} className='text-sm flex items-center justify-center px-4 py-1 h-7 hover:bg-gray-300 cursor-pointer'>
                                             Log Out
                                        </p>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     )
}

export default Navbar