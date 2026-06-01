export const USER_ROLES = {
  VIEWER: 'viewer',
  CREATOR: 'creator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DECEASED: 'deceased',
  SUSPENDED: 'suspended',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

export interface User {
  uid: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  photo?: string
}
