import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
     try {
          const token = req.cookies.token;
          if (!token) {
               return res.status(401).json({ success: false, type: 'error', message: 'Not Authorized , no token' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Mongoose query: password aur unnecessary OTP fields ko exclude karke user fetch kar rahe hain
          const user = await User.findById(decoded.id).select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt');

          if (!user) {
               return res.status(401).json({ success: false, message: 'Not Authorized, no user found', type: 'error' });
          }

          req.user = user;
          next();
     } catch (error) {
          console.log(error);
          return res.status(401).json({ success: false, message: 'Not Authorized, token failed', type: 'error' });
     }
};