import React from 'react'
import { useState } from "react";
import api from "../api/api.js";
import { Lock, Mail, UserRound, X, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'


const Auth = () => {

     const { setUser } = useAuth();
     const navigate = useNavigate();
     const [isLogin, setIsLogin] = useState(true);
     const [showPassword, setShowPassword] = useState(false);
     const [form, setForm] = useState({
          username: "",
          email: "",
          password: "",
          rememberMe: false
     });

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const url = isLogin ? "/auth/login" : "/auth/register";
          const payload = isLogin
               ? { email: form.email, password: form.password, rememberMe: form.rememberMe }
               : form;

          try {
               const res = await api.post(url, payload);

               if (res.data.success) {
                    setUser(res.data.data);
                    navigate("/");
               }

          } catch (err) {
               // error toast interceptor already handle karega
          } finally {
               setForm({
                    username: "",
                    email: "",
                    password: "",
                    rememberMe: ""
               })
          }
     };


     function back() {
          if (window.history.length > 1) navigate(-1);
          else navigate("/"); // fallback route
     }





     const responseGoogle = async (authResult) => {
          try {
               if (authResult['code']) {
                    const res = await api.get(`/auth/google?code=${authResult['code']}`)

                    if (res?.data) {
                         const data = res.data.data
                         setUser(data)
                         navigate('/')
                    }
               }
          } catch (error) {
               console.error('Error is here : ', error)
          }
     }


     const googleLogin = useGoogleLogin({
          onSuccess: responseGoogle,
          onerror: responseGoogle,
          flow: 'auth-code'
     })





     return (
          <div className="min-h-screen flex items-center justify-center ">
               <div className="relative border border-gray-300/60 bg-white text-white w-87.5 p-8 rounded-2xl shadow-xl">
                    <div className='absolute top-3 right-3 rounded-full hover:bg-gray-400/10 p-1 cursor-pointer' onClick={back} >
                         <X size={24} className='text-gray-600' />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 text-center">
                         {isLogin ? "Welcome back" : "Create your account"}
                    </h2>

                    <p className='text-[12px] font-light mb-3 text-gray-600 text-center' >{`${isLogin ? "Sign in to your account" : "Get started in seconds"}`}</p>

                    <form onSubmit={handleSubmit} className=" space-y-4 text-">

                         <div onClick={googleLogin} className="flex items-center justify-center w-full bg-white border border-gray-300/80 hover:bg-gray-100/40 h-11 rounded-md overflow-hidden cursor-pointer pl-6 gap-2">
                              <img src="/google-logo.png" alt="google-logo" className='h-7' />
                              <p className='text-gray-700' >Continue with Google</p>
                         </div>

                         <div className='h-[0.25px] bg-gray-300/80 relative' >
                              <p className='absolute -translate-y-1/2 left-1/2 -translate-x-1/2 px-2 bg-white z-5 text-xs text-gray-400/70' >OR</p>
                         </div>

                         {!isLogin && (
                              <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden focus-within:border-indigo-500 pl-6 gap-2">
                                   <UserRound className='text-gray-500' size={16} />
                                   <input type="text" name="username" placeholder="Full Name" autoComplete='username' className="border-none outline-none placeholder:text-gray-400 ring-0 text-gray-600" value={form.username} onChange={handleChange} required />
                              </div>
                         )}

                         <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden focus-within:border-indigo-500 pl-6 gap-2">
                              <Mail className='text-gray-500' size={16} />
                              <input type="email" name="email" placeholder="Email" autoComplete='email' className="border-none outline-none ring-0 text-gray-600 placeholder:text-gray-400" value={form.email} onChange={handleChange} required />
                         </div>

                         <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden focus-within:border-indigo-500 pl-6 gap-2">
                              <Lock className='text-gray-500' size={16} />
                              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" autoComplete='current-password' className="border-none outline-none ring-0 text-gray-600 placeholder:text-gray-400" value={form.password} onChange={handleChange} required />
                              <button type='button' onClick={() => setShowPassword(prev => !prev)} className='text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200' >{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                         </div>

                         {isLogin && (
                              <div className="flex items-center justify-between text-sm">

                                   <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400" />
                                        <span className="text-gray-600">Remember me</span>
                                   </label>

                                   <Link to={'/reset-password'} >
                                        <button type="button" className="text-blue-500 hover:underline outline-none cursor-pointer">
                                             Forgot password?
                                        </button>
                                   </Link>
                              </div>
                         )}


                         <button className="w-full active:scale-[0.98] py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 font-semibold hover:opacity-90">
                              {isLogin ? "Sign in" : "Sign up"}
                         </button>
                    </form>

                    <p className="text-sm text-center text-gray-500 mt-4">
                         {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                         <span
                              onClick={() => setIsLogin(!isLogin)}
                              className="text-blue-500 hover:underline cursor-pointer"
                         >
                              {isLogin ? "Register" : "Login"}
                         </span>
                    </p>
               </div>
          </div>
     )
}

export default Auth











/*
while google auth we are getting this 


auth_provider
: 
"google"
email
: 
"vijax01@gmail.com"
id
: 
1
image_url
: 
"https://lh3.googleusercontent.com/a/ACg8ocLFJkF0YXijjR-XtphVHs-bmpYC8fHgH1z5yb_2ClF4hpJjTw=s96-c"
is_account_verified
: 
true
username
: 
"Vijax"







while email login we are getting this . 


*/