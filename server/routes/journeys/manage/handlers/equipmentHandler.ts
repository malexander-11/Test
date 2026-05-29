import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { allVisitors, amendBaseUrl, getOfficialVisit, stepsChecked } from '../journeyState'

export default function equipmentHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/equipment', {
      backUrl: amend ? amendBaseUrl(req) : '/manage/create/assistance-required',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      contacts: allVisitors(officialVisit),
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    allVisitors(officialVisit).forEach(v => {
      v.equipment = req.body[`equipment-${v.contactId}`] === 'yes'
      v.equipmentNotes = v.equipment ? String(req.body[`equipmentNotes-${v.contactId}`] || '').trim() || undefined : undefined
    })
    officialVisit.equipmentPageCompleted = true

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        officialVisitors: officialVisit.officialVisitors,
        socialVisitors: officialVisit.socialVisitors,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect('/manage/create/comments')
  }

  return { GET, POST }
}
