import express from 'express';
const app = express();


import cors from 'cors';
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}))


import cookieParser from 'cookie-parser';
app.use(cookieParser())


app.use(express.json())



import authRouter from './routes/auth.routes.js'
app.use('/api/auth', authRouter);


export default app;