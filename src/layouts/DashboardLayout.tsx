import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
