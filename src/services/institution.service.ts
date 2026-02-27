import prisma from "../config/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createInstitutionWithAdmin = async (
  name: string,
  adminEmail: string,
  adminPassword: string
) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.institution.findUnique({
      where: { name },
    });

    if (existing) {
      throw { status: 400, message: "Institution already exists" };
    }

    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    const institution = await tx.institution.create({
      data: { name },
    });

    const adminUser = await tx.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: Role.INSTITUTION_ADMIN,
        institutionId: institution.id,
      },
    });

    return { institution, adminUser };
  });
};