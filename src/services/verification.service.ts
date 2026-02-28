import { findByVerificationId } from "../repositories/document.repository";

export const verifyDocumentService = async (verificationId: string) => {
  if (!verificationId) {
    throw { status: 400, message: "Verification ID required" };
  }

  const document = await findByVerificationId(verificationId);

  if (!document) {
    throw { status: 404, message: "Document not found" };
  }

  return {
    status: document.status,
    institution: document.institution.name,
    verifiedAt: document.updatedAt,
    fileHash: document.fileHash,
  };
};