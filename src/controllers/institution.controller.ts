import { Request, Response, NextFunction } from "express";
import { createInstitutionWithAdmin } from "../services/institution.service";
import { successResponse } from "../utils/response.util";
export const createInstitutionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, adminEmail, adminPassword } = req.body;

    const result = await createInstitutionWithAdmin(
      name,
      adminEmail,
      adminPassword
    );

      res.status(201).json({
        success: true,
        institutionId: result.institution.id,
        adminId: result.adminUser.id,
      });
  } catch (error) {
    next(error);
  }
};