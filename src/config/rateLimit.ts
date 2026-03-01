import rateLimit from "express-rate-limit";

// 🔐 Strict limiter for login (Brute-force protection)
export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔁 Moderate limiter for refresh token
export const refreshRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many refresh attempts. Please try later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🌍 Public verification limiter (anti-scraping)
export const verifyRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: {
    success: false,
    message: "Too many verification requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});