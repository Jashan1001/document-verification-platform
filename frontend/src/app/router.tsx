import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/app-layout";
import DashboardPage from "../features/dashboard/dashboard-page";
import DocumentsPage from "../features/documents/documents-page";
import LoginPage from "../features/auth/login-page";
import ProtectedRoute from "./protected-route";

// Future placeholders
function AdminPage() {
  return <div>Admin Panel</div>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  // All authenticated users
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "documents", element: <DocumentsPage /> },
        ],
      },
    ],
  },

  // SUPER_ADMIN only routes
  {
    element: <ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "admin", element: <AdminPage /> },
        ],
      },
    ],
  },
]);