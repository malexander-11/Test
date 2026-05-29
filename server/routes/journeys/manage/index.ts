import { Router } from 'express'
import type { Services } from '../../../services'

// A heavily simplified version of the "book an official visit" journey. The
// real service is a multi-step, session-backed wizard (prisoner search ->
// visitors -> type -> time slot -> check answers -> confirmation). Here we keep
// just the first two steps so the shape of the journey is visible.
export default function manage(services: Services): Router {
  const router = Router()

  router.get('/create/search', (req, res) => {
    res.render('pages/manage/search')
  })

  router.get('/create/search-results', async (req, res) => {
    const query = String(req.query.query || '')
    const results = await services.prisonerService.search(query)
    res.render('pages/manage/searchResults', { query, results })
  })

  return router
}
