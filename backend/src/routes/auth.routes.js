import { Router } from "express";
const authRouter = Router();





import { getUser, googleLogin, loginUser, logOutUser, registerUser, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyResetOtp } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";





authRouter.get('/google', googleLogin);
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', protect, getUser);
authRouter.post('/logout', logOutUser);
authRouter.post('/send-verify-otp', protect, sendVerifyOtp);       // send verify otp , user sirf frontend ke ek verify email button pe click karega. aur email pe otp jayegi 
authRouter.post('/verify-account', protect, verifyEmail );       // verify email , to user otp bhejega
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-otp', verifyResetOtp);
authRouter.post('/reset-password', resetPassword);





export default authRouter;