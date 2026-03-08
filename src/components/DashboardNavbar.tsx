import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";

export function DashboardNavbar() {
  const user = useAuthStore((s) => s.user);

  const avatarSrc = user?.photo ? `data:image/png;base64,${user.photo}` : undefined;
  const avatarFallback = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-4">
      <SidebarTrigger />
      <Avatar>
        <AvatarImage src={avatarSrc} alt={user?.name} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    </header>
  );
}
