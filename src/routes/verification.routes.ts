import { Router } from "express";
import { verifyDocumentController } from "../controllers/verification.controller";
import { verifyRateLimiter } from "../config/rateLimit";

const router = Router();

router.get(
  "/:verificationId",
  verifyRateLimiter,
  verifyDocumentController
);

export default router;