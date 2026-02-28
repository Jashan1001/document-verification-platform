import { Request, Response, NextFunction } from "express";
import { verifyDocumentService } from "../services/verification.service";

export const verifyDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationId = req.params.verificationId;

    if (!verificationId || Array.isArray(verificationId)) {
      throw { status: 400, message: "Invalid verification ID" };
    }

    const result = await verifyDocumentService(verificationId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};