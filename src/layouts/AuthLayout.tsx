import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Outlet />
      <Toaster />
    </main>
  );
}
