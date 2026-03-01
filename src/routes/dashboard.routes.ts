import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getDashboardSummaryController } from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/summary",
  authenticate,
  getDashboardSummaryController
);

export default router;