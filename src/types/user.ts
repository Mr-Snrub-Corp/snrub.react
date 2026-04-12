import { USER_ROLES, USER_STATUS } from "@/constants/user";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
// "type UserRole = 'viewer' | 'creator' | 'admin' | 'super_admin'"
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  photo?: string;
}
