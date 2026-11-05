export const cookieOptions = {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
     maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
   };