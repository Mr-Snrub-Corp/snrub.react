// User role options
export const USER_ROLES = {
  VIEWER: "viewer",
  CREATOR: "creator",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

/* 
// Without as const, values would just be string, with const TS sees 
{
  readonly VIEWER: "viewer";
  readonly CREATOR: "creator";
  readonly ADMIN: "admin";
  readonly SUPER_ADMIN: "super_admin";
}
*/

// User status options
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DECEASED: "deceased",
  SUSPENDED: "suspended",
} as const;
