import { Router } from "express";
import { verifyDocumentController } from "../controllers/verification.controller";

const router = Router();

router.get("/:verificationId", verifyDocumentController);

export default router;