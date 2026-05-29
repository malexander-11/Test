import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { amendBaseUrl, equipmentEnabled, getOfficialVisit, stepsChecked } from '../journeyState'

export default function commentsHandler({ officialVisitsService }: Services) {
  const GET: RequestHandler = (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/comments', {
      backUrl: amend
        ? amendBaseUrl(req)
        : equipmentEnabled(officialVisit)
          ? '/manage/create/equipment'
          : '/manage/create/assistance-required',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      staffNotes: officialVisit.staffNotes,
      prisonerNotes: officialVisit.prisonerNotes,
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    officialVisit.staffNotes = String(req.body.staffNotes || '').trim() || undefined
    officialVisit.prisonerNotes = String(req.body.prisonerNotes || '').trim() || undefined
    officialVisit.commentsPageCompleted = true

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        staffNotes: officialVisit.staffNotes,
        prisonerNotes: officialVisit.prisonerNotes,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect('/manage/create/check-your-answers')
  }

  return { GET, POST }
}
