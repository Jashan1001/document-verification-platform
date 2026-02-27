import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../config/multer";
import { uploadDocumentController } from "../controllers/document.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  uploadDocumentController
);

export default router;