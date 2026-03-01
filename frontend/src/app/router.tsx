import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/app-layout";
import DashboardPage from "../features/dashboard/dashboard-page";
import DocumentsPage from "../features/documents/documents-page";
import LoginPage from "../features/auth/login-page";
import ProtectedRoute from "./protected-route";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,   // 👈 protect everything below
    children: [
      {
        path: "/",
        element: <AppLayout />,   // 👈 layout stays here
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "documents",
            element: <DocumentsPage />,
          },
        ],
      },
    ],
  },
]);