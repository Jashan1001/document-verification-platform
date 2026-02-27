import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./config/prisma";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { authorize } from "./middleware/rbac.middleware";
import institutionRoutes from "./routes/institution.routes";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/institutions", institutionRoutes);
app.get(
  "/admin-only",
  authenticate,
  authorize(["SUPER_ADMIN"]),
  (req, res) => {
    res.json({
      message: "Welcome Super Admin",
    });
  }
);
app.get("/health", authenticate, async (req, res) => {
  const usersCount = await prisma.user.count();

  res.status(200).json({
    message: "Protected health check",
    usersCount,
  });
});

export default app;