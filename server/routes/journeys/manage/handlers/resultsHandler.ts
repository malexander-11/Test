import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { getOfficialVisit, stepsChecked } from '../journeyState'

export default function resultsHandler({ prisonerService }: Services) {
  const GET: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const results = await prisonerService.search(officialVisit.searchTerm ?? '')
    res.render('pages/manage/searchResults', {
      backUrl: '/manage/create/search',
      query: officialVisit.searchTerm,
      results,
      stepsChecked: stepsChecked(officialVisit),
    })
  }

  return { GET }
}
