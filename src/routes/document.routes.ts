import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { upload } from "../config/multer";
import { Role } from "@prisma/client";
import {
  uploadDocumentController,
  updateDocumentStatusController,
  verifyPublicController,
  getDocumentByIdController,
  getDocumentsController,
} from "../controllers/document.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([Role.USER, Role.INSTITUTION_ADMIN]),
  upload.single("file"),
  uploadDocumentController
);

router.patch(
  "/:documentId/status",
  authenticate,
  authorize([Role.INSTITUTION_ADMIN, Role.VERIFIER]),
  updateDocumentStatusController
);

router.get(
  "/",
  authenticate,
  getDocumentsController
);

router.get(
  "/:documentId",
  authenticate,
  getDocumentByIdController
);

router.get(
  "/verify/:verificationId",
  verifyPublicController // NO AUTH
);

export default router;