import { Router } from 'express'
import createError from '../../../utils/httpError'
import type { Services } from '../../../services'

export default function view(services: Services): Router {
  const router = Router()

  // List / search existing visits.
  router.get('/list', async (req, res) => {
    const query = String(req.query.prisoner || '')
    const allVisits = await services.officialVisitsService.getVisits()
    const visits = query
      ? allVisits.filter(v =>
          `${v.prisoner.firstName} ${v.prisoner.lastName} ${v.prisoner.prisonerNumber}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
      : allVisits

    res.render('pages/view/visitList', { visits, filter: { prisoner: query } })
  })

  // View a single visit.
  router.get('/visit/:officialVisitId', async (req, res, next) => {
    const visit = await services.officialVisitsService.getVisit(req.params.officialVisitId)
    if (!visit) {
      return next(createError(404, 'Visit not found'))
    }
    return res.render('pages/view/visit', { visit })
  })

  return router
}
