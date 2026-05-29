import { RequestHandler } from 'express'
import { getOfficialVisit, stepsChecked } from '../journeyState'

export default function commentsHandler() {
  const GET: RequestHandler = (req, res) => {
    const officialVisit = getOfficialVisit(req)
    res.render('pages/manage/comments', {
      backUrl: '/manage/create/select-visitors',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      staffNotes: officialVisit.staffNotes,
      prisonerNotes: officialVisit.prisonerNotes,
    })
  }

  const POST: RequestHandler = (req, res) => {
    const officialVisit = getOfficialVisit(req)
    officialVisit.staffNotes = String(req.body.staffNotes || '').trim() || undefined
    officialVisit.prisonerNotes = String(req.body.prisonerNotes || '').trim() || undefined
    officialVisit.commentsPageCompleted = true
    return res.redirect('/manage/create/check-your-answers')
  }

  return { GET, POST }
}
