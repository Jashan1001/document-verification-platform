import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { successResponse } from "../utils/response.util";
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json(
      successResponse(
        { token: data.token },
        "Login successful"
      )
    );
  } catch (error) {
    next(error);
  }
};