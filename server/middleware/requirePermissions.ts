import { RequestHandler } from 'express'
import { Permission } from '../interfaces/hmppsUser'

// Gate a router/route behind a permission. The dummy user holds every
// permission, so this never blocks locally — it's kept to mirror the real
// service's structure and to make it obvious where access control lives.
export function requirePermissions(permission: Permission): RequestHandler {
  return (req, res, next) => {
    const { user } = res.locals
    if (user?.permissions?.includes(permission)) {
      return next()
    }
    return res.status(403).render('pages/not-authorised')
  }
}
