import { NavLink } from "react-router";
import { HomeIcon, TriangleAlertIcon, UsersIcon } from "lucide-react";
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

const navItems = [
  { to: "/dashboard", label: "Home", icon: HomeIcon },
  { to: "/dashboard/team", label: "Team", icon: UsersIcon },
  { to: "/dashboard/incidents", label: "Incidents", icon: TriangleAlertIcon },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2">
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
              {navItems.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={to} end>
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
      <SidebarFooter />
    </Sidebar>
  );
}
