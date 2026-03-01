import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { refresh, logout } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { loginRateLimiter, refreshRateLimiter } from "../config/rateLimit";
const router = Router();


router.post("/register", register);
router.post("/login", loginRateLimiter, login);
router.post("/refresh", refreshRateLimiter, refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
export default router;