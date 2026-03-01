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
    const document = await tx.document.findFirst({
      where: {
        id: documentId,
        deletedAt: null,
      },
    });

    if (!document) {
      throw { status: 404, message: "Document not found" };
    }

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

    const updateData: any = {
      status: newStatus,
    };

    // Set reviewer metadata only if approved/rejected
    if (
      newStatus === DocumentStatus.APPROVED ||
      newStatus === DocumentStatus.REJECTED
    ) {
      updateData.reviewedById = user.userId;
      updateData.reviewedAt = new Date();
    }

    const updatedDocument = await tx.document.update({
      where: { id: documentId },
      data: updateData,
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
export const getDocumentsService = async (user: {
  userId: string;
  role: string;
  institutionId?: string | null;
}) => {
  if (!user.institutionId) {
    throw { status: 403, message: "Invalid tenant context" };
  }

  return prisma.document.findMany({
    where: {
      institutionId: user.institutionId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getDocumentByIdService = async (
  documentId: string,
  user: {
    userId: string;
    role: string;
    institutionId?: string | null;
  }
) => {
  if (!user.institutionId) {
    throw { status: 403, message: "Invalid tenant context" };
  }

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      institutionId: user.institutionId,
      deletedAt: null,
    },
    include: {
      uploadedBy: {
        select: { id: true, email: true },
      },
      logs: true,
    },
  });

  if (!document) {
    throw { status: 404, message: "Document not found" };
  }

  return document;
};

export const getDocumentByVerificationIdService = async (
  verificationId: string
) => {
  const document = await prisma.document.findUnique({
    where: { verificationId },
    include: {
      institution: {
        select: { id: true, name: true },
      },
    },
  });

  if (!document) {
    throw { status: 404, message: "Verification ID not found" };
  }

  if (document.status !== DocumentStatus.APPROVED) {
    throw { status: 400, message: "Document not verified yet" };
  }

  return {
    title: document.title,
    verificationId: document.verificationId,
    institution: document.institution.name,
    status: document.status,
    reviewedAt: document.reviewedAt,
  };
};