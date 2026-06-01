import { NavLink, useNavigate } from "react-router";
import {
  HomeIcon,
  LogOutIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth";
import { useUsersStore } from "@/stores/users";

const navItems = [
  { to: "/dashboard", label: "Home", icon: HomeIcon, testId: "nav.sidebar.home-link" },
  { to: "/dashboard/employees", label: "Employees", icon: UsersIcon, testId: "nav.sidebar.employees-link" },
  { to: "/dashboard/incidents", label: "Incidents", icon: TriangleAlertIcon, testId: "nav.sidebar.incidents-link" },
];

export function DashboardSidebar() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const resetUsers = useUsersStore((s) => s.reset);
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    resetUsers();
    navigate("/auth/login");
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <div className="bg-primary-600 flex items-center justify-center py-3">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-black bg-yellow-400 text-xl font-bold">
            <img
              src="/img/nuclear-symbol.png"
              alt="Snrub Corp logo"
              className="h-8 w-8"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ to, label, icon: Icon, testId }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={to} end data-testid={testId}>
                      <Icon />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton data-testid="nav.sidebar.logout-btn" onClick={handleLogout}>
              <LogOutIcon />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
