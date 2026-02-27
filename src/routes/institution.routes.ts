import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { createInstitutionController } from "../controllers/institution.controller";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([Role.SUPER_ADMIN]),
  createInstitutionController
);

export default router;