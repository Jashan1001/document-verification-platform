import { Request, Response, NextFunction } from "express";
import { uploadDocumentService } from "../services/document.service";

export const uploadDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;

    const document = await uploadDocumentService(
      req.file as Express.Multer.File,
      title,
      description,
      req.user!
    );

    res.status(201).json({
      success: true,
      documentId: document.id,
      verificationId: document.verificationId,
    });
  } catch (error) {
    next(error);
  }
};