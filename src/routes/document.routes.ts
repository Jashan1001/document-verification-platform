import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { upload } from "../config/multer";
import { Role } from "@prisma/client";
import {
  uploadDocumentController,
  updateDocumentStatusController,
} from "../controllers/document.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  uploadDocumentController
);

router.patch(
  "/:documentId/status",
  authenticate,
  authorize([Role.INSTITUTION_ADMIN, Role.VERIFIER]),
  updateDocumentStatusController
);

export default router;