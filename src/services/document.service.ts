import fs from "fs";
import { generateFileHash } from "../utils/hash.util";
import { generateVerificationId } from "../utils/id.util";
import { createDocument } from "../repositories/document.repository";
import { DocumentStatus } from "@prisma/client";
import prisma from "../config/prisma";

const allowedTransitions: Record<DocumentStatus, DocumentStatus[]> = {
  UPLOADED: [DocumentStatus.UNDER_REVIEW],
  UNDER_REVIEW: [DocumentStatus.APPROVED, DocumentStatus.REJECTED],
  APPROVED: [],
  REJECTED: [],
};

export const updateDocumentStatusService = async (
  documentId: string,
  newStatus: DocumentStatus,
  remarks: string | undefined,
  user: {
    userId: string;
    role: string;
    institutionId?: string | null;
  }
) => {
  if (!user.institutionId) {
    throw { status: 403, message: "Invalid tenant context" };
  }

  return prisma.$transaction(async (tx) => {
    const document = await tx.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw { status: 404, message: "Document not found" };
    }

    // Multi-tenant isolation
    if (document.institutionId !== user.institutionId) {
      throw { status: 403, message: "Access denied for this institution" };
    }

    const currentStatus = document.status;

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw {
        status: 400,
        message: `Invalid state transition from ${currentStatus} to ${newStatus}`,
      };
    }

    const updatedDocument = await tx.document.update({
      where: { id: documentId },
      data: { status: newStatus },
    });

    await tx.verificationLog.create({
      data: {
        documentId: document.id,
        actionById: user.userId,
        previousStatus: currentStatus,
        newStatus,
        remarks,
        institutionId: user.institutionId,
      },
    });

    return updatedDocument;
  });
};
export const uploadDocumentService = async (
  file: Express.Multer.File,
  title: string,
  description: string | undefined,
  user: {
    userId: string;
    role: string;
    institutionId?: string | null;
  }
) => {
  if (!user.institutionId) {
    throw { status: 400, message: "User must belong to an institution" };
  }

  if (!file) {
    throw { status: 400, message: "File is required" };
  }

  const filePath = file.path;

  const fileHash = await generateFileHash(filePath);

  const verificationId = generateVerificationId();

  const document = await createDocument({
    title,
    description,
    fileUrl: filePath,
    fileHash,
    verificationId,
    uploadedById: user.userId,
    institutionId: user.institutionId,
  });
  

  return document;
};