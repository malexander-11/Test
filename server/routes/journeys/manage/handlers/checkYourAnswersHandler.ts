import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { getJourney, getOfficialVisit, stepsChecked } from '../journeyState'

export default function checkYourAnswersHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = (req, res) => {
    const officialVisit = getOfficialVisit(req)
    res.render('pages/manage/checkYourAnswers', {
      backUrl: '/manage/create/comments',
      visit: officialVisit,
      prisoner: officialVisit.prisoner,
      contacts: officialVisit.officialVisitors,
      stepsChecked: stepsChecked(officialVisit),
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const { officialVisitId } = await officialVisitsService.createVisit(officialVisit)
    getJourney(req).journeyCompleted = true
    return res.redirect(`/manage/create/confirmation/${officialVisitId}`)
  }

  return { GET, POST }
}
