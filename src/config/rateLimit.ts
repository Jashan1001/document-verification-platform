import rateLimit from "express-rate-limit";

// Strict limiter for public verification
export const verifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requests per IP per window
  message: {
    success: false,
    message: "Too many verification requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate limiter for login
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});