import { USER_STATUS } from "@/constants/user";
import { type User, type UserStatus } from "@/types/user";

export function getAvatarSrc(user: User | null) {
  return user?.photo ? `data:image/png;base64,${user.photo}` : undefined;
}
export function getAvatarFallback(user: User | null) {
  return user?.name?.charAt(0).toUpperCase() ?? "?";
}

export function getStatusVariant(
  status: UserStatus,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return "default";
    case USER_STATUS.INACTIVE:
      return "secondary";
    case USER_STATUS.SUSPENDED:
    case USER_STATUS.DECEASED:
      return "destructive";
  }
}
