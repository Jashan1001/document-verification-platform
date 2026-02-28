import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { createUser, findUserByEmail } from "../repositories/user.repository";

const SALT_ROUNDS = 10;

export const registerUser = async (
  email: string,
  password: string,
  role: Role = Role.USER,
  institutionId?: string
) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw { status: 400, message: "Email already registered" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Save user
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

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      institutionId: user.institutionId,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { token };
};