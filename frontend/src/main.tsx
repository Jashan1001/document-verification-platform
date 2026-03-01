import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router";
import { ThemeProvider } from "./app/theme-provider";
import { useAuthStore } from "./store/auth-store";


import "./index.css";
useAuthStore.getState().checkAuth();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);