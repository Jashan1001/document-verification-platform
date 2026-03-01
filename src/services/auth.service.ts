import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Role } from "@prisma/client";
import prisma from "../config/prisma";
import { createUser, findUserByEmail } from "../repositories/user.repository";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const generateAccessToken = (user: {
  id: string;
  role: Role;
  institutionId?: string | null;
}) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      institutionId: user.institutionId,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const registerUser = async (
  email: string,
  password: string,
  role: Role = Role.USER,
  institutionId?: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw { status: 400, message: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return createUser(email, hashedPassword, role, institutionId);
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // 🔒 Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw {
      status: 403,
      message: "Account is temporarily locked. Please try again later.",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const updatedAttempts = user.failedAttempts + 1;

    // If 5 failed attempts → lock account for 10 minutes
    if (updatedAttempts >= 5) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: updatedAttempts,
          lockUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });

      throw {
        status: 403,
        message:
          "Too many failed attempts. Account locked for 10 minutes.",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: updatedAttempts },
    });

    throw { status: 401, message: "Invalid credentials" };
  }

  // ✅ Password correct — reset failed attempts & unlock account
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedAttempts: 0,
      lockUntil: null,
      lastLoginAt: new Date(),
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ),
    },
  });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw { status: 401, message: "Invalid refresh token" };
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });
    throw { status: 401, message: "Refresh token expired" };
  }

  const newAccessToken = generateAccessToken(storedToken.user);

  return { accessToken: newAccessToken };
};

export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};