import type { User } from "@/types/user";

export function getAvatarSrc(user: User | null) {
  return user?.photo ? `data:image/png;base64,${user.photo}` : undefined;
}
export function getAvatarFallback(user: User | null) {
  return user?.name?.charAt(0).toUpperCase() ?? "?";
}
