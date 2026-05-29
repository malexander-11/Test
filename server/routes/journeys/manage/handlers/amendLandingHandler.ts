import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import createError from '../../../../utils/httpError'
import { allVisitors, amendBaseUrl, equipmentEnabled, getJourney } from '../journeyState'

// Entry point for amending a visit. Loads the stored visit into the journey so
// the shared step handlers can edit it, then shows a summary with "Change"
// links to each step. Mirrors the real AmendVisitLandingHandler.
export default function amendLandingHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = async (req, res, next) => {
    const visit = await officialVisitsService.getVisit(req.params.ovId)
    if (!visit) {
      return next(createError(404, 'Visit not found'))
    }

    const officialVisit = {
      officialVisitId: visit.officialVisitId,
      prisoner: visit.prisoner,
      visitType: visit.visitType,
      visitTypeDescription: visit.visitTypeDescription,
      selectedTimeSlot: {
        timeSlotId: visit.timeSlotId ?? '',
        visitDate: visit.visitDate,
        startTime: visit.startTime,
        endTime: visit.endTime,
        locationDescription: visit.locationDescription,
      },
      officialVisitors: visit.officialVisitors,
      socialVisitors: visit.socialVisitors,
      staffNotes: visit.staffNotes,
      prisonerNotes: visit.prisonerNotes,
    }
    getJourney(req).officialVisit = officialVisit

    return res.render('pages/manage/amendLanding', {
      backUrl: `/view/visit/${visit.officialVisitId}`,
      base: amendBaseUrl(req),
      visit,
      prisoner: visit.prisoner,
      contacts: allVisitors(officialVisit),
      showEquipment: equipmentEnabled(officialVisit),
    })
  }

  return { GET }
}
