import { RequestHandler } from 'express'
import { getOfficialVisit } from '../journeyState'

export default function searchHandler() {
  const GET: RequestHandler = (req, res) => {
    res.render('pages/manage/search', {
      backUrl: '/',
      searchTerm: getOfficialVisit(req).searchTerm,
    })
  }

  const POST: RequestHandler = (req, res) => {
    const searchTerm = String(req.body.query || '').trim()
    if (!searchTerm) {
      return res.render('pages/manage/search', {
        backUrl: '/',
        validationErrors: [{ field: 'query', message: 'Enter a prisoner name or prison number' }],
      })
    }
    getOfficialVisit(req).searchTerm = searchTerm
    return res.redirect('/manage/create/results')
  }

  return { GET, POST }
}
