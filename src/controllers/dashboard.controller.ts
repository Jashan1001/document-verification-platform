import { Request, Response, NextFunction } from "express";
import { getDashboardSummaryService } from "../services/dashboard.service";
import { successResponse } from "../utils/response.util";

export const getDashboardSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await getDashboardSummaryService(req.user!);

    res.json(
      successResponse(summary, "Dashboard summary fetched")
    );
  } catch (error) {
    next(error);
  }
};