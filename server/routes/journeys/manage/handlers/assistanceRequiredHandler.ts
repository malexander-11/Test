import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import {
  allVisitors,
  amendBaseUrl,
  equipmentEnabled,
  getOfficialVisit,
  socialVisitorsEnabled,
  stepsChecked,
} from '../journeyState'

export default function assistanceRequiredHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/assistanceRequired', {
      backUrl: amend
        ? amendBaseUrl(req)
        : socialVisitorsEnabled(officialVisit)
          ? '/manage/create/select-social-visitors'
          : '/manage/create/select-official-visitors',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      contacts: allVisitors(officialVisit),
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    allVisitors(officialVisit).forEach(v => {
      v.assistedVisit = req.body[`assistedVisit-${v.contactId}`] === 'yes'
      v.assistanceNotes = v.assistedVisit ? String(req.body[`assistanceNotes-${v.contactId}`] || '').trim() || undefined : undefined
    })
    officialVisit.assistancePageCompleted = true

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        officialVisitors: officialVisit.officialVisitors,
        socialVisitors: officialVisit.socialVisitors,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect(
      equipmentEnabled(officialVisit) ? '/manage/create/equipment' : '/manage/create/comments',
    )
  }

  return { GET, POST }
}
