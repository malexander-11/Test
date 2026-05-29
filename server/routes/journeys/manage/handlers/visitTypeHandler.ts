import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { getOfficialVisit, stepsChecked } from '../journeyState'

export default function visitTypeHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const visitTypes = await officialVisitsService.getVisitTypes()
    res.render('pages/manage/visitType', {
      backUrl: '/manage/create/results',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items: visitTypes.map(t => ({
        value: t.code,
        text: t.description,
        checked: t.code === officialVisit.visitType,
      })),
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const visitTypes = await officialVisitsService.getVisitTypes()
    const visitType = visitTypes.find(t => t.code === req.body.visitType)
    if (!visitType) {
      return res.render('pages/manage/visitType', {
        backUrl: '/manage/create/results',
        prisoner: officialVisit.prisoner,
        stepsChecked: stepsChecked(officialVisit),
        items: visitTypes.map(t => ({ value: t.code, text: t.description })),
        validationErrors: [{ field: 'visitType', message: 'Select a type of official visit' }],
      })
    }
    officialVisit.visitType = visitType.code
    officialVisit.visitTypeDescription = visitType.description
    return res.redirect('/manage/create/time-slot')
  }

  return { GET, POST }
}
