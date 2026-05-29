import { Router } from 'express'
import type { Services } from '../../../services'
import { ensureJourney, requireStep } from './journeyState'
import searchHandler from './handlers/searchHandler'
import resultsHandler from './handlers/resultsHandler'
import prisonerSelectHandler from './handlers/prisonerSelectHandler'
import visitTypeHandler from './handlers/visitTypeHandler'
import timeSlotHandler from './handlers/timeSlotHandler'
import selectVisitorsHandler from './handlers/selectVisitorsHandler'
import commentsHandler from './handlers/commentsHandler'
import checkYourAnswersHandler from './handlers/checkYourAnswersHandler'
import confirmationHandler from './handlers/confirmationHandler'

// The "book an official visit" journey. A simplified, single-session version of
// the real multi-step wizard:
//   search -> results -> pick prisoner -> visit type -> time slot ->
//   visitors -> extra info -> check answers -> confirmation
export default function manage(services: Services): Router {
  const router = Router()

  router.use('/create', ensureJourney)

  const search = searchHandler()
  router.get('/create/search', search.GET)
  router.post('/create/search', search.POST)

  const results = resultsHandler(services)
  router.get('/create/results', requireStep('results'), results.GET)

  const prisonerSelect = prisonerSelectHandler(services)
  router.get('/create/prisoner-select', requireStep('results'), prisonerSelect.GET)

  const visitType = visitTypeHandler(services)
  router.get('/create/visit-type', requireStep('visit-type'), visitType.GET)
  router.post('/create/visit-type', requireStep('visit-type'), visitType.POST)

  const timeSlot = timeSlotHandler(services)
  router.get('/create/time-slot', requireStep('time-slot'), timeSlot.GET)
  router.post('/create/time-slot', requireStep('time-slot'), timeSlot.POST)

  const selectVisitors = selectVisitorsHandler(services)
  router.get('/create/select-visitors', requireStep('select-visitors'), selectVisitors.GET)
  router.post('/create/select-visitors', requireStep('select-visitors'), selectVisitors.POST)

  const comments = commentsHandler()
  router.get('/create/comments', requireStep('comments'), comments.GET)
  router.post('/create/comments', requireStep('comments'), comments.POST)

  const checkYourAnswers = checkYourAnswersHandler(services)
  router.get('/create/check-your-answers', requireStep('check-your-answers'), checkYourAnswers.GET)
  router.post('/create/check-your-answers', requireStep('check-your-answers'), checkYourAnswers.POST)

  const confirmation = confirmationHandler(services)
  router.get('/create/confirmation/:officialVisitId', confirmation.GET)

  return router
}
