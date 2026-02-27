import { nanoid } from "nanoid";

export const generateVerificationId = () => {
  return nanoid(16); // 16-char public safe ID
};