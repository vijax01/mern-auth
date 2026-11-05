import { useEffect, useState } from "react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {


     const { user, setUser } = useAuth();


     return (
          <div className="min-h-screen ">

               {/* Main */}
               <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">
                         <img className="h-80 mt-30" src="/header_img.png" alt="header image" />
                    </div>

                    <h2 className="text-xl text-gray-600">
                         Hey {user ? user.username?.split(" ")[0] : 'Developer'} 👋
                    </h2>

                    <h1 className="text-4xl font-bold mt-2">
                         Welcome to MERN Auth !
                    </h1>

                    {user && (
                         <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 max-w-sm mx-auto shadow-sm text-left">
                              <p className="text-slate-600 text-sm font-medium flex justify-between items-center py-1 border-b border-slate-100">
                                   <span className="text-slate-400 text-xs uppercase tracking-wider">Email</span>
                                   <span className="text-slate-700">{user?.email || 'N/A'}</span>
                              </p>
                              <p className="text-slate-600 text-sm font-medium flex justify-between items-center pt-2">
                                   <span className="text-slate-400 text-xs uppercase tracking-wider">User ID</span>
                                   <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{user?._id || 'N/A'}</span>
                              </p>
                              <p className="text-slate-600 text-sm font-medium flex justify-between items-center pt-2">
                                   <span className="text-slate-400 text-xs uppercase tracking-wider">Verified</span>
                                   {user.isAccountVerified ? (
                                        <span className="font-mono text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">YES</span>
                                   ) : (
                                        <span className="font-mono text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">NO</span>
                                   )}
                              </p>
                         </div>
                    )}
               </div>
          </div>
     );
}