import { Link, useLocation } from "react-router";
import { HomeIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";

function DashboardBreadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  // segments for /dashboard/team => ["dashboard", "team"]
  const afterDashboard = segments.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {afterDashboard.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>
              <HomeIcon className="size-4" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">
                  <HomeIcon className="size-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {afterDashboard.map((segment, i) => {
              const isLast = i === afterDashboard.length - 1;
              const href = "/dashboard/" + afterDashboard.slice(0, i + 1).join("/");
              const label = segment.charAt(0).toUpperCase() + segment.slice(1);

              return (
                <span key={href} className="contents">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function DashboardNavbar() {
  const user = useAuthStore((s) => s.user);

  const avatarSrc = user?.photo ? `data:image/png;base64,${user.photo}` : undefined;
  const avatarFallback = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-4 md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
        <DashboardBreadcrumb />
      </div>
      <Avatar>
        <AvatarImage src={avatarSrc} alt={user?.name} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    </header>
  );
}
