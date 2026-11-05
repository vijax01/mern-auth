import React, { useEffect, useRef } from 'react'
import { useState } from "react";
import api from "../api/api.js";
import { Lock, Mail, UserRound, X, Eye, EyeOff, ArrowLeft, ArrowLeftIcon } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import { notify } from '../utils/toast.js';

const EmailVerifyPage = () => {


     const { user, fetchUser } = useAuth();
     const inputRefs = useRef([])
     const navigate = useNavigate();     


     const handleInput = (e, index) => {
          if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
               inputRefs.current[index + 1].focus();
          }
     }
     
     
     const handleKeyDown = (e, index) => {
          if(e.key === 'Backspace' && e.target.value === '' && index > 0){
               inputRefs.current[index - 1].focus();
          }
     }


     const handlePaste = (e) => {
          const paste = e.clipboardData.getData('text');
          const pasteArray = paste.split('');
          pasteArray.forEach((char, index)=>{
               if(inputRefs.current[index]) {
                    inputRefs.current[index].value = char;
               }
          })
     }


     const onSubmitHandler = async (e) => {
          try  {
               e.preventDefault();
               const otpArray = inputRefs.current.map(e => e.value);
               const otp = otpArray.join('');
               const res = await api.post('/auth/verify-account', { otp });
               if (res.data.success) {
                    fetchUser();
                    back();
               }
          } catch(error) {
               console.log(error.message);
               notify('Otp sending Error', 'error');
          }
     }


     function back() {
          if (window.history.length > 1) navigate(-1);
          else navigate("/"); // fallback route
     }


     return (
          <div className="min-h-screen flex items-center justify-center ">
               <div className="relative group border border-gray-300/60 bg-white text-white w-87.5 p-8 rounded-2xl shadow-xl">
                    <div className='hidden absolute group-hover:block top-3 left-3 rounded-full hover:bg-gray-400/10 p-1 cursor-pointer' onClick={back} >
                         <ArrowLeft size={18} className='text-gray-500' />
                    </div>
                    <h2 className="text-2xl mb-2 font-semibold text-gray-900 text-center">
                         Email Verify Otp
                    </h2>

                    <p className='text-[12px] font-light mb-3 text-gray-600 text-center' >Enter the 6 digit code sent to your email id.</p>

                    <form onSubmit={(e) => onSubmitHandler(e)} className=" space-y-4 text-">

                         <div className='flex gap-2 justify-between mb-4 ' onPaste={handlePaste} >
                              {Array(6).fill(0).map((_, index) => (
                                   <input ref={e => inputRefs.current[index] = e} onKeyDown={(e) => handleKeyDown(e, index)} onInput={(e) => handleInput(e, index)} type="text" maxLength={1} key={index} required className='w-10 h-10 bg-gray-100 text-gray-700 text-center text-xl rounded-md outline-none border border-gray-300 focus:border-indigo-500' />
                              ))}
                         </div>

                         <div className="flex items-center justify-center text-gray-600 font-light text-xs">

                              Didn't receive the code?
                              <button type="button" className="text-blue-500 ml-1 hover:underline outline-none cursor-pointer">
                                   Request Again
                              </button>

                         </div>


                         <button className="w-full active:scale-[0.98] py-2 rounded-lg cursor-pointer bg-linear-to-r from-indigo-500 to-purple-500 font-semibold hover:opacity-90">
                              Verify Email
                         </button>
                    </form>

               </div>
          </div>
     )
}

export default EmailVerifyPage
