import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import "./index.css";
import AuthLayout from "./layouts/AuthLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import HomeView from "./pages/HomeView.tsx";
import Login from "./pages/auth/Login.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";

import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import Team from "./pages/dashboard/Team.tsx";
import Incidents from "./pages/dashboard/Incidents.tsx";
import { useAuthStore } from "@/stores/auth";

async function requireAuth() {
  // Cant use hooks  (loaders are plain functions)
  const { token } = useAuthStore.getState();
  if (!token) {
    return redirect("auth/login");
  }
}

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <HomeView /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/forgot-password", element: <ForgotPassword /> },
      { path: "/auth/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: <DashboardLayout />,
    loader: requireAuth,
    children: [
      { path: "/dashboard", element: <DashboardHome /> },
      { path: "/dashboard/team", element: <Team /> },
      { path: "/dashboard/incidents", element: <Incidents /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
