import User from '../models/user.model.js';
import { cookieOptions } from '../utils/cookieOptions.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from '../configs/nodeMailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../configs/emailTemplates.js';
import { oauth2client } from '../configs/googleConfig.js';
import axios from 'axios';

const generateToken = (id, rememberMe = false) => {
     return jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: rememberMe ? '30d' : '1d',
     });
};

export const registerUser = async (req, res) => {
     const { username, email, password } = req.body;

     if (!username?.trim() || !email?.trim() || !password?.trim()) {
          return res.status(400).json({ success: false, message: 'Please provide all fields', type: 'error' });
     }

     try {
          const userExists = await User.findOne({ email });
          if (userExists) {
               return res.status(409).json({ success: false, message: 'User already exists', type: 'info' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await User.create({
               username,
               email,
               password: hashedPassword,
          });

          const token = generateToken(newUser._id);
          res.cookie('token', token, cookieOptions);

          const mailOptions = {
               from: process.env.SENDER_EMAIL,
               to: email,
               subject: 'Welcome to MERN Auth',
               text: `Hi, ${username} Welcome to a secure MERN stack based Authentication System. Your account has been created with email id: ${email}`,
          };

          await transporter.sendMail(mailOptions);

          const userData = {
               _id: newUser._id,
               username: newUser.username,
               email: newUser.email,
               isAccountVerified: newUser.isAccountVerified,
               authProvider: newUser.authProvider,
               imageUrl: newUser.imageUrl,
          };

          return res.status(201).json({
               success: true,
               message: `Welcome ${newUser.username.split(' ')[0]}`,
               type: 'success',
               data: userData,
          });
     } catch (error) {
          console.log(error);
          return res.status(500).json({ success: false, type: 'error', message: 'Something went wrong' });
     }
};

export const loginUser = async (req, res) => {
     const { email, password, rememberMe } = req.body;

     if (!email || !password) {
          return res.status(400).json({ success: false, message: 'Please provide all fields', type: 'error' });
     }

     try {
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(401).json({ success: false, message: 'Invalid email or password', type: 'error' });
          }

          if (!user.password && user.authProvider === 'google') {
               return res.status(409).json({ success: false, message: 'This account uses Google Sign-In.', type: 'warning' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               return res.status(401).json({ success: false, message: 'Invalid email or password', type: 'error' });
          }

          const token = generateToken(user._id, rememberMe);
          const options = {
               ...cookieOptions,
               maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
          };
          res.cookie('token', token, options);

          const userData = user.toObject();
          delete userData.password;

          return res.status(200).json({ success: true, message: 'Logged In', type: 'success', data: userData });
     } catch (error) {
          console.log(error);
          return res.status(500).json({ success: false, type: 'error', message: 'Something went wrong' });
     }
};

export const getUser = async (req, res) => {
     return res.status(200).json({ success: true, message: 'Authorized User', type: 'success', data: req.user });
};

export const logOutUser = async (req, res) => {
     try {
          res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
          return res.status(200).json({ success: true, message: 'Logged Out', type: 'info' });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: 'Something went wrong' });
     }
};

export const sendVerifyOtp = async (req, res) => {
     try {
          const userId = req.user._id || req.user.id;
          const user = await User.findById(userId);

          if (user.isAccountVerified) {
               return res.status(200).json({ success: true, type: 'info', message: 'Account already verified' });
          }

          const otp = String(Math.floor(100000 + Math.random() * 900000));
          user.verifyOtp = otp;
          user.verifyOtpExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          await user.save();

          const mailOptions = {
               from: process.env.SENDER_EMAIL,
               to: user.email,
               subject: 'Account Verification OTP',
               html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email),
          };

          await transporter.sendMail(mailOptions);
          return res.status(200).json({ success: true, type: 'success', message: 'Verification OTP Send on Email' });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({ success: false, type: 'error', message: 'Error Sending Verification Otp' });
     }
};

export const verifyEmail = async (req, res) => {
     const userId = req.user._id || req.user.id;
     const { otp } = req.body;

     if (!userId || !otp) {
          return res.status(400).json({ success: true, type: 'error', message: 'Missing Details' });
     }

     try {
          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({ success: false, type: 'error', message: 'User not found' });
          }

          if (!user.verifyOtp || user.verifyOtp !== otp) {
               return res.status(400).json({ success: false, type: 'error', message: 'Invalid OTP' });
          }

          if (user.verifyOtpExpireAt < Date.now()) {
               return res.status(400).json({ success: false, type: 'error', message: 'OTP expired' });
          }

          user.isAccountVerified = true;
          user.verifyOtp = null;
          user.verifyOtpExpireAt = null;
          await user.save();

          return res.status(200).json({ success: true, type: 'success', message: 'Email verified successfully' });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({ success: false, type: 'error', message: 'Internal Server Error' });
     }
};

export const sendResetOtp = async (req, res) => {
     const { email } = req.body;
     if (!email) {
          return res.status(400).json({ success: false, message: 'Email is required', type: 'error' });
     }

     try {
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(401).json({ success: false, message: 'User not found', type: 'error' });
          }

          const reset_otp = String(Math.floor(100000 + Math.random() * 900000));
          user.resetOtp = reset_otp;
          user.resetOtpExpireAt = new Date(Date.now() + 15 * 60 * 1000);
          await user.save();

          const mailOptions = {
               from: process.env.SENDER_EMAIL,
               to: email,
               subject: 'Password Reset OTP',
               html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', reset_otp).replace('{{email}}', email),
          };

          await transporter.sendMail(mailOptions);
          return res.status(200).json({ success: true, type: 'success', message: 'OTP sent to your email' });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({ success: false, type: 'error', message: 'Error Sending Reset Otp' });
     }
};

export const verifyResetOtp = async (req, res) => {
     const { email, otp } = req.body;
     if (!email || !otp) {
          return res.status(400).json({ success: false, message: 'Otp or Email not found', type: 'error' });
     }

     try {
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(401).json({ success: false, message: 'User not found', type: 'error' });
          }

          if (!user.resetOtp || user.resetOtp !== otp) {
               return res.status(400).json({ success: false, type: 'error', message: 'Invalid OTP' });
          }

          return res.status(200).json({ success: true, type: 'success', message: 'OTP verified successfully' });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({ success: false, type: 'error', message: 'Reset OTP Verification failed' });
     }
};

export const resetPassword = async (req, res) => {
     const { email, otp, newPassword } = req.body;
     if (!email || !otp || !newPassword) {
          return res.status(400).json({ success: false, message: 'Please provide all fields', type: 'error' });
     }

     try {
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(401).json({ success: false, message: 'User not found', type: 'error' });
          }

          if (!user.resetOtp || user.resetOtp !== otp) {
               return res.status(400).json({ success: false, type: 'error', message: 'Invalid OTP' });
          }

          if (user.resetOtpExpireAt < Date.now()) {
               return res.status(400).json({ success: false, type: 'error', message: 'OTP expired' });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          user.resetOtp = null;
          user.resetOtpExpireAt = null;
          await user.save();

          return res.status(200).json({ success: true, type: 'success', message: 'Password reset successful' });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({ success: false, type: 'error', message: 'Reset failed' });
     }
};

export const googleLogin = async (req, res) => {
     try {
          const { code } = req.query;
          const googleRes = await oauth2client.getToken(code);
          oauth2client.setCredentials(googleRes.tokens);

          const userRes = await axios.get(
               `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
          );

          const { id, email, name, picture } = userRes?.data;

          let user = await User.findOne({ email });

          if (user) {
               user.googleId = id;
               user.imageUrl = picture;
               user.authProvider = 'google';
               user.isAccountVerified = true;
               await user.save();
          } else {
               user = await User.create({
                    username: name,
                    email,
                    googleId: id,
                    imageUrl: picture,
                    authProvider: 'google',
                    isAccountVerified: true,
               });
          }

          const token = generateToken(user._id);
          res.cookie('token', token, cookieOptions);

          const userData = user.toObject();
          if (userData.password) delete userData.password;

          return res.status(200).json({ success: true, type: 'success', message: 'Logged in', data: userData });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, type: 'error', message: 'Internal Server Error' });
     }
};
