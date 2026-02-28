import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./config/prisma";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { authorize } from "./middleware/rbac.middleware";
import institutionRoutes from "./routes/institution.routes";
import documentRoutes from "./routes/document.routes";
import { Request, Response, NextFunction } from "express";
import verificationRoutes from "./routes/verification.routes";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/institutions", institutionRoutes);
app.use("/documents", documentRoutes);
app.use("/verify", verificationRoutes);

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

// Optional 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 ERROR HANDLER MUST BE LAST
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error middleware caught:", err);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;