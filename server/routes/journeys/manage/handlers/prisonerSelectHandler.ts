import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { getOfficialVisit } from '../journeyState'

export default function prisonerSelectHandler({ prisonerService }: Services) {
  // Selecting a prisoner from the results list stores them on the journey and
  // moves on to the first booking step.
  const GET: RequestHandler = async (req, res) => {
    const prisoner = await prisonerService.getPrisoner(String(req.query.prisonerNumber || ''))
    if (!prisoner) {
      return res.redirect('/manage/create/results')
    }
    getOfficialVisit(req).prisoner = prisoner
    return res.redirect('/manage/create/visit-type')
  }

  return { GET }
}
