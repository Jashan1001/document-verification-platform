import { Request, Response, NextFunction } from "express";
import { uploadDocumentService } from "../services/document.service";
import { DocumentStatus } from "@prisma/client";
import { updateDocumentStatusService } from "../services/document.service";



export const updateDocumentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documentId = req.params.documentId;

    if (!documentId || Array.isArray(documentId)) {
      throw { status: 400, message: "Invalid documentId parameter" };
    }

    const { status, remarks } = req.body;

    const updatedDocument = await updateDocumentStatusService(
      documentId,
      status as DocumentStatus,
      remarks,
      req.user!
    );

    res.json({
      success: true,
      newStatus: updatedDocument.status,
    });
  } catch (error) {
    next(error);
  }
};
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