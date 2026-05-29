// Mirrors the shape of the real service's user/permission model, trimmed down.
export enum Permission {
  DEFAULT = 'DEFAULT',
  VIEW = 'VIEW',
  MANAGE = 'MANAGE',
  ADMIN = 'ADMIN',
}

export interface HmppsUser {
  username: string
  name: string
  displayName: string
  activeCaseLoadId: string
  permissions: Permission[]
}
