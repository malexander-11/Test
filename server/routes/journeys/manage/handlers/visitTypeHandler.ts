import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { amendBaseUrl, getOfficialVisit, stepsChecked } from '../journeyState'

export default function visitTypeHandler({ officialVisitsService }: Services) {
  const render = (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1], items: unknown, validationErrors?: unknown) => {
    const officialVisit = getOfficialVisit(req)
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/visitType', {
      backUrl: amend ? amendBaseUrl(req) : '/manage/create/results',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items,
      validationErrors,
    })
  }

  const GET: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const visitTypes = await officialVisitsService.getVisitTypes()
    render(req, res, visitTypes.map(t => ({ value: t.code, text: t.description, checked: t.code === officialVisit.visitType })))
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const visitTypes = await officialVisitsService.getVisitTypes()
    const visitType = visitTypes.find(t => t.code === req.body.visitType)
    if (!visitType) {
      return render(req, res, visitTypes.map(t => ({ value: t.code, text: t.description })), [
        { field: 'visitType', message: 'Select a type of official visit' },
      ])
    }
    officialVisit.visitType = visitType.code
    officialVisit.visitTypeDescription = visitType.description

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        visitType: visitType.code,
        visitTypeDescription: visitType.description,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect('/manage/create/time-slot')
  }

  return { GET, POST }
}
