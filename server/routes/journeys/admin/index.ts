import { Router } from 'express'
import type { Services } from '../../../services'

export default function admin(services: Services): Router {
  const router = Router()

  router.get('/locations', async (req, res) => {
    const locations = await services.locationsService.getLocations()
    res.render('pages/admin/locations', { locations })
  })

  return router
}
