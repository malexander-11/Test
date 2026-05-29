import { Router } from 'express'
import type { Services } from '../../../services'

export default function home(_services: Services): Router {
  const router = Router()

  router.get('/', (req, res) => {
    res.render('pages/home/home')
  })

  return router
}
