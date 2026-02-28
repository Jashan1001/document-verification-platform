import prisma from "../config/prisma";
import { DocumentStatus } from "@prisma/client";

export const createDocument = async (data: {
  title: string;
  description?: string;
  fileUrl: string;
  fileHash: string;
  verificationId: string;
  uploadedById: string;
  institutionId: string;
}) => {
  return prisma.document.create({
    data: {
      ...data,
      status: DocumentStatus.UPLOADED,
    },
  });
};
export const findByVerificationId = async (verificationId: string) => {
  return prisma.document.findUnique({
    where: { verificationId },
    include: {
      institution: true,
    },
  });
};