const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};
