import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authRateLimiter } from "../config/rateLimit";
const router = Router();

router.post("/register", register);
router.post("/login", authRateLimiter, login);

export default router;