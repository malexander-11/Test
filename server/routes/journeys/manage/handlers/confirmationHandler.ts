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
    // The booking is done — clear the journey so a refresh or "book another"
    // starts clean. Visitor details are read from the persisted visit, so the
    // page still renders correctly on refresh.
    getJourney(req).officialVisit = undefined

    return res.render('pages/manage/confirmVisit', {
      visit,
      prisoner: visit.prisoner,
      officialVisitors: [...visit.officialVisitors, ...visit.socialVisitors],
      officialVisitId: visit.officialVisitId,
    })
  }

  return { GET }
}
