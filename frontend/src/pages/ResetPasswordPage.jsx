import { useState, useEffect } from "react";
import api from "../api/api.js";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import { useRef } from "react";
import { notify } from "../utils/toast.js";



const ResetPasswordPage = () => {

     const { setUser } = useAuth();
     const inputRefs = useRef([])
     const navigate = useNavigate();
     const [email, setEmail] = useState('');
     const [showEmailBox, setShowEmailBox] = useState(true);
     const [otp, setOtp] = useState('');
     const [showOtpBox, setShowOtpBox] = useState(false);
     const [newPassword, setNewPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);
     const [showNewPasswordInputBox, setShowNewPasswordInputBox] = useState(false);


     const handleEmailSubmit = async (e) => {
          e.preventDefault();
          try {
               const res = await api.post('/auth/send-reset-otp', { email });
               if (res.data.success) {
                    setShowEmailBox(false);
                    setShowOtpBox(true);
                    startTimer();
               }

          } catch {

          }
     };


     const handleInput = (e, index) => {
          if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
               inputRefs.current[index + 1].focus();
          }
     }


     const handleKeyDown = (e, index) => {
          if (e.key === "Enter") {
               e.preventDefault();
               handleResetOtpSubmit(e);
               return;
          }

          if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
               inputRefs.current[index - 1].focus();
          }
     };


     const handlePaste = (e) => {
          const paste = e.clipboardData.getData('text');
          const pasteArray = paste.split('');
          pasteArray.forEach((char, index) => {
               if (inputRefs.current[index]) {
                    inputRefs.current[index].value = char;
               }
          })
     }


     const handleResetOtpSubmit = async (e) => {
          try {
               e.preventDefault();
               const otpArray = inputRefs.current.map(e => e.value);
               const temp = otpArray.join('');
               setOtp(temp);
               const res = await api.post('/auth/verify-reset-otp', { email, otp: temp });
               if (res.data.success) {
                    setShowOtpBox(false);
                    setShowNewPasswordInputBox(true);
               }
          } catch (error) {
               console.log(error.message);
          }
     }


     const handleNewPasswordSubmit = async (e) => {
          try {
               e.preventDefault();
               if (!email.trim() || !otp.trim() || !newPassword.trim()) {
                    notify('Invalid email or password or otp', 'error')
               }
               const res = await api.post('/auth/reset-password', { otp, email, newPassword });
               if (res.data.success) {
                    setShowNewPasswordInputBox(false);
                    setShowEmailBox(false);
                    navigate('/auth')
               }
          } catch (error) {
               console.log(error.message);
               notify('Error saving New Password', 'error');
          }
     }


     function back() {
          if (window.history.length > 1) navigate(-1);
          else navigate("/"); // fallback route
     }


     const [timeLeft, setTimeLeft] = useState(0);

     const startTimer = () => {
          setTimeLeft(60);
     
          const interval = setInterval(() => {
               setTimeLeft((prev) => {
                    if (prev <= 1) {
                         clearInterval(interval);
                         return 0;
                    }
     
                    return prev - 1;
               });
          }, 1000);
     };


     const handleResendOtp = async () => {
          try {
               if(email !== ''){
                    console.log('clickeingsdfsa')
                    const res = await api.post('/auth/send-reset-otp', { email });
                    if (res.data.success) {
                         console.log('success');
                    }
                    console.log(timeLeft);
                    setTimeLeft(60);
               }
          }catch(error) {
               console.log('ddfdfdfd')
               notify(error.message)
          }
     };


     return (
          <div className="min-h-screen flex items-center justify-center ">
               <div className="relative group border border-gray-300/60 bg-white text-white w-87.5 p-8 rounded-2xl shadow-xl">
                    <div className='hidden absolute group-hover:block top-3 left-3 rounded-full hover:bg-gray-400/10 p-1 cursor-pointer' onClick={back} >
                         <ArrowLeft size={18} className='text-gray-500' />
                    </div>

                    {/* Enter email id form */}
                    {showEmailBox && (
                         <>
                              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                                   Reset password
                              </h2>

                              <p className='text-[12px] font-light mb-3 mt-1 text-gray-600 text-center' >Enter your registered email address</p>

                              <form onSubmit={handleEmailSubmit} className=" space-y-4">

                                   <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden focus-within:border-indigo-500 pl-6 gap-2">
                                        <Mail className='text-gray-500' size={16} />
                                        <input type="email" name="email" placeholder="Email id" autoComplete='email' className="border-none outline-none ring-0 text-gray-600 placeholder:text-gray-400" value={email} onChange={e => setEmail(e.target.value)} required />
                                   </div>

                                   <button className="w-full active:scale-[0.98] py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 font-semibold hover:opacity-90">
                                        Submit
                                   </button>

                              </form>
                         </>
                    )}

                    {/* Enter otp form */}
                    {showOtpBox && (
                         <>
                              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                                   Reset Password OTP
                              </h2>

                              <p className='text-[12px] font-light mb-3 mt-1 text-gray-600 text-center' >Enter the 6-digit code sent to your email id.</p>

                              <form onSubmit={(e) => handleResetOtpSubmit(e)} className=" space-y-4 text-">

                                   <div className='flex gap-2 justify-between mb-4 ' onPaste={handlePaste} >
                                        {Array(6).fill(0).map((_, index) => (
                                             <input ref={e => inputRefs.current[index] = e} onKeyDown={(e) => handleKeyDown(e, index)} onInput={(e) => handleInput(e, index)} type="text" maxLength={1} key={index} required className='w-10 h-10 bg-gray-100 text-gray-700 text-center text-xl rounded-md outline-none border border-gray-300 focus:border-indigo-500' />
                                        ))}
                                   </div>

                                   <div className="flex items-center justify-center text-gray-600 font-light text-xs">

                                        Didn't receive the code?
                                        <button onClick={handleResendOtp} type="button" disabled={timeLeft > 0} className="text-blue-500 ml-1 hover:underline outline-none cursor-pointer disabled:text-blue-300 disabled:cursor-not-allowed">
                                             {timeLeft > 0 ? `Resend Otp in ${timeLeft}` : 'Resend Otp'}
                                        </button>

                                   </div>


                                   <button className="w-full active:scale-[0.98] py-2 rounded-lg cursor-pointer bg-linear-to-r from-indigo-500 to-purple-500 font-semibold hover:opacity-90">
                                        Submit
                                   </button>
                              </form>
                         </>
                    )}

                    {showNewPasswordInputBox && (
                         <>
                              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                                   New Password
                              </h2>

                              <p className='text-[12px] font-light mb-3 mt-1 text-gray-600 text-center' >Enter the new password below</p>

                              <form onSubmit={e => handleNewPasswordSubmit(e)} className=" space-y-4">

                                   <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden focus-within:border-indigo-500 pl-6 gap-2">
                                        <Lock className='text-gray-500' size={16} />
                                        <input type="email" name="email" value={email} onChange={setEmail} autoComplete="username" hidden />
                                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" autoComplete='current-password' className="border-none outline-none ring-0 text-gray-600 placeholder:text-gray-400" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                        <button type='button' onClick={() => setShowPassword(prev => !prev)} className='text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200' >{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                   </div>

                                   <button className="w-full active:scale-[0.98] py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 font-semibold hover:opacity-90">
                                        Submit
                                   </button>

                              </form>
                         </>
                    )}

               </div>
          </div>
     )
}

export default ResetPasswordPage
