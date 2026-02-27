import prisma from "../config/prisma";
import { Role } from "@prisma/client";

export const createUser = async (
  email: string,
  password: string,
  role: Role,
  institutionId?: string
) => {
  return prisma.user.create({
    data: {
      email,
      password,
      role,
      institutionId,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};