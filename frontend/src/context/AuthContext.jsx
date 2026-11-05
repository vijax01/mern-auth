import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";


const AuthContext = createContext();         // created the container to store global variables


export const AuthProvider = ({ children }) => {

     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     const fetchUser = async () => {
          try {
               const res = await api.get("/auth/me", { skipToast: true } );
               setUser(res.data.data);
          } catch (err) {
               if (err.response?.status !== 401) {
                    console.error(err); // sirf real errors log karo
               }
               setUser(null);
          } finally {
               setLoading(false);
          }
     };


     useEffect(() => {
          fetchUser(); // app load pe 
     }, []);

     return (
          <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
               {children}
          </AuthContext.Provider>
     );
};


// custom hook (clean usage)
export const useAuth = () => useContext(AuthContext);