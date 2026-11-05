import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

     const { user } = useAuth();
     return user ? <Navigate to='/' /> : children ;
     
}

export default ProtectedRoute
