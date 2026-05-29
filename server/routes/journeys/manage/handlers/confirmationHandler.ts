import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import createError from '../../../../utils/httpError'
import { getJourney } from '../journeyState'

export default function confirmationHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = async (req, res, next) => {
    const visit = await officialVisitsService.getVisit(req.params.officialVisitId)
    if (!visit) {
      return next(createError(404, 'Visit not found'))
    }
    // The booking is done — capture what we need, then clear the journey so a
    // refresh or "book another" starts clean.
    const officialVisitors = getJourney(req).officialVisit?.officialVisitors || []
    getJourney(req).officialVisit = undefined

    return res.render('pages/manage/confirmVisit', {
      hideBetaBanner: false,
      visit,
      prisoner: visit.prisoner,
      officialVisitors,
      officialVisitId: visit.officialVisitId,
    })
  }

  return { GET }
}
