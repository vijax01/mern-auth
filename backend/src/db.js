import mongoose from "mongoose";


import dotenv from "dotenv";
dotenv.config();


import dns from "dns";
dns.setServers(
     ['1.1.1.1']
)


const connectDB = async () => {
     try {
          const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
          console.clear();
          console.log("DB connected successfully");
     } catch (error) {
          console.log("DB connection error 1 :", error);
          process.exit(1);
     }
}


export default connectDB;