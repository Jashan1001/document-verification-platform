import { Request, Response, NextFunction } from "express";
import { uploadDocumentService } from "../services/document.service";
import { DocumentStatus } from "@prisma/client";
import { updateDocumentStatusService } from "../services/document.service";
import { successResponse } from "../utils/response.util";
import {
  getDocumentsService,
  getDocumentByIdService,
  getDocumentByVerificationIdService,
} from "../services/document.service";

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

    res.json(
  successResponse(
    { status: updatedDocument.status },
    "Document status updated"
  )
);
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

    res.status(201).json(
      successResponse(
        {
          documentId: document.id,
          verificationId: document.verificationId,
        },
        "Document uploaded successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
export const getDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await getDocumentsService(req.user!);

    res.json(successResponse(documents, "Documents fetched"));
  } catch (error) {
    next(error);
  }
};

export const getDocumentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documentId = req.params.documentId;

    if (!documentId || Array.isArray(documentId)) {
      throw { status: 400, message: "Invalid documentId parameter" };
    }

    const document = await getDocumentByIdService(
      documentId,
      req.user!
    );

    res.json(successResponse(document, "Document fetched"));
  } catch (error) {
    next(error);
  }
};

export const verifyPublicController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationId = req.params.verificationId;

    if (!verificationId || Array.isArray(verificationId)) {
      throw { status: 400, message: "Invalid verificationId parameter" };
    }

    const data = await getDocumentByVerificationIdService(
      verificationId
    );

    res.json(successResponse(data, "Verification successful"));
  } catch (error) {
    next(error);
  }
};