import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/app-layout";
import DashboardPage from "../features/dashboard/dashboard-page";
import DocumentsPage from "../features/documents/documents-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
]);