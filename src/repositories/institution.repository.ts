import prisma from "../config/prisma";

export const createInstitution = async (name: string) => {
  return prisma.institution.create({
    data: { name },
  });
};

export const findInstitutionByName = async (name: string) => {
  return prisma.institution.findUnique({
    where: { name },
  });
};