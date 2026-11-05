import axios from "axios";
import { notify } from "../utils/toast.js";


const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     withCredentials: true, // to send cookies to backend , used when login is managed with jwt. To actually make this work , we need to set credentials true in the cors config. If we are using auth + cookies then keep it true otherwise its optional.
});


api.interceptors.response.use(
     (response) => {

          const { success, message, type } = response.data;

          if (!response.config?.skipToast && message) {
               const validTypes = ["success", "error", "info", "warning"];

               const toastType = validTypes.includes(type)
                    ? type
                    : success
                         ? "success"
                         : "error"; 

               notify(message, toastType);
          } 

          return response;
     },
     (error) => {
          const message = error?.response?.data?.message || "Something went wrong";

          if (!error.config?.skipToast && message) {
               notify(message, "error");
          }

          return Promise.reject(error);
     }
);


export default api;

// axios.post(url, data, config) skiptoast is a part of config now .