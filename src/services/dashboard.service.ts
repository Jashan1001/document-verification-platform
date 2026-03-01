import prisma from "../config/prisma";
import { DocumentStatus } from "@prisma/client";

export const getDashboardSummaryService = async (user: any) => {
  const whereClause =
    user.role === "SUPER_ADMIN"
      ? {}
      : { institutionId: user.institutionId };

  const total = await prisma.document.count({
    where: whereClause,
  });

  const uploaded = await prisma.document.count({
    where: { ...whereClause, status: DocumentStatus.UPLOADED },
  });

  const underReview = await prisma.document.count({
    where: { ...whereClause, status: DocumentStatus.UNDER_REVIEW },
  });

  const approved = await prisma.document.count({
    where: { ...whereClause, status: DocumentStatus.APPROVED },
  });

  const rejected = await prisma.document.count({
    where: { ...whereClause, status: DocumentStatus.REJECTED },
  });

  const recentDocuments = await prisma.document.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
    },
  });

  return {
    total,
    uploaded,
    underReview,
    approved,
    rejected,
    recentDocuments,
  };
};