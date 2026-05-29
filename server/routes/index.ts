import { Router } from 'express'
import type { Services } from '../services'
import home from './journeys/home'
import view from './journeys/view'
import manage from './journeys/manage'
import admin from './journeys/admin'
import { requirePermissions } from '../middleware/requirePermissions'
import { Permission } from '../interfaces/hmppsUser'

export default function routes(services: Services): Router {
  const router = Router()

  router.use('/', requirePermissions(Permission.DEFAULT), home(services))
  router.use('/view', requirePermissions(Permission.VIEW), view(services))
  router.use('/manage', requirePermissions(Permission.MANAGE), manage(services))
  router.use('/admin', requirePermissions(Permission.ADMIN), admin(services))

  return router
}
