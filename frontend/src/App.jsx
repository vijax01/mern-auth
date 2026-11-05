import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import EmailVerifyPage from './pages/EmailVerifyPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'
import PageNotFound from './pages/PageNotFound';
import { GoogleOAuthProvider } from '@react-oauth/google'



const App = () => {

     const { user } = useAuth();

     return (
          <>

               <Routes >

                    <Route path="/" element={<Layout />} >
                         <Route index element={<Dashboard />} />
                         <Route path="auth" element={

                              <ProtectedRoute >
                                   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
                                        <Auth />
                                   </GoogleOAuthProvider>
                              </ProtectedRoute>} />

                         <Route path="/email-verify" element={!user ? <Navigate to="/auth" /> : user?.is_account_verified ? <Navigate to="/" /> : <EmailVerifyPage />} />
                         <Route path='reset-password' element={<ResetPasswordPage />} />
                         
                    </Route>

                    <Route path="*" element={<PageNotFound />} />

               </Routes>

               <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} />

          </>
     )
}

export default App