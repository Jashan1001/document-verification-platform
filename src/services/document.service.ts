import fs from "fs";
import { generateFileHash } from "../utils/hash.util";
import { generateVerificationId } from "../utils/id.util";
import { createDocument } from "../repositories/document.repository";

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