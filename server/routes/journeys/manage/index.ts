import { RequestHandler, Router } from 'express'
import type { Services } from '../../../services'
import { ensureJourney, requireAmendJourney, requireStep } from './journeyState'
import searchHandler from './handlers/searchHandler'
import resultsHandler from './handlers/resultsHandler'
import prisonerSelectHandler from './handlers/prisonerSelectHandler'
import visitTypeHandler from './handlers/visitTypeHandler'
import timeSlotHandler from './handlers/timeSlotHandler'
import selectOfficialVisitorsHandler from './handlers/selectOfficialVisitorsHandler'
import selectSocialVisitorsHandler from './handlers/selectSocialVisitorsHandler'
import assistanceRequiredHandler from './handlers/assistanceRequiredHandler'
import equipmentHandler from './handlers/equipmentHandler'
import commentsHandler from './handlers/commentsHandler'
import checkYourAnswersHandler from './handlers/checkYourAnswersHandler'
import confirmationHandler from './handlers/confirmationHandler'
import amendLandingHandler from './handlers/amendLandingHandler'

const setMode =
  (mode: 'create' | 'amend'): RequestHandler =>
  (req, res, next) => {
    res.locals.mode = mode
    next()
  }

// The "book an official visit" journey. A simplified, single-session version of
// the real multi-step wizard. The same step handlers power both the "create"
// flow and the "amend" flow (where each step saves straight back to the visit).
//
//   create: search -> results -> pick prisoner -> visit type -> time slot ->
//           official visitors -> social visitors -> assistance -> equipment ->
//           extra info -> check answers -> confirmation
//
//   amend:  landing (summary with Change links) -> any single step -> landing
export default function manage(services: Services): Router {
  const router = Router()

  const visitType = visitTypeHandler(services)
  const timeSlot = timeSlotHandler(services)
  const selectOfficialVisitors = selectOfficialVisitorsHandler(services)
  const selectSocialVisitors = selectSocialVisitorsHandler(services)
  const assistanceRequired = assistanceRequiredHandler(services)
  const equipment = equipmentHandler(services)
  const comments = commentsHandler(services)

  // ---- Create journey -------------------------------------------------------
  router.use('/create', ensureJourney, setMode('create'))

  const search = searchHandler()
  router.get('/create/search', search.GET)
  router.post('/create/search', search.POST)

  const results = resultsHandler(services)
  router.get('/create/results', requireStep('results'), results.GET)

  const prisonerSelect = prisonerSelectHandler(services)
  router.get('/create/prisoner-select', requireStep('results'), prisonerSelect.GET)

  router.get('/create/visit-type', requireStep('visit-type'), visitType.GET)
  router.post('/create/visit-type', requireStep('visit-type'), visitType.POST)

  router.get('/create/time-slot', requireStep('time-slot'), timeSlot.GET)
  router.post('/create/time-slot', requireStep('time-slot'), timeSlot.POST)

  router.get('/create/select-official-visitors', requireStep('select-official-visitors'), selectOfficialVisitors.GET)
  router.post('/create/select-official-visitors', requireStep('select-official-visitors'), selectOfficialVisitors.POST)

  router.get('/create/select-social-visitors', requireStep('select-social-visitors'), selectSocialVisitors.GET)
  router.post('/create/select-social-visitors', requireStep('select-social-visitors'), selectSocialVisitors.POST)

  router.get('/create/assistance-required', requireStep('assistance-required'), assistanceRequired.GET)
  router.post('/create/assistance-required', requireStep('assistance-required'), assistanceRequired.POST)

  router.get('/create/equipment', requireStep('equipment'), equipment.GET)
  router.post('/create/equipment', requireStep('equipment'), equipment.POST)

  router.get('/create/comments', requireStep('comments'), comments.GET)
  router.post('/create/comments', requireStep('comments'), comments.POST)

  const checkYourAnswers = checkYourAnswersHandler(services)
  router.get('/create/check-your-answers', requireStep('check-your-answers'), checkYourAnswers.GET)
  router.post('/create/check-your-answers', requireStep('check-your-answers'), checkYourAnswers.POST)

  const confirmation = confirmationHandler(services)
  router.get('/create/confirmation/:officialVisitId', confirmation.GET)

  // ---- Amend journey --------------------------------------------------------
  router.use('/amend/:ovId', ensureJourney, setMode('amend'))

  const amendLanding = amendLandingHandler(services)
  router.get('/amend/:ovId', amendLanding.GET)

  const amendStep = (step: string, handler: { GET: RequestHandler; POST: RequestHandler }) => {
    router.get(`/amend/:ovId/${step}`, requireAmendJourney, handler.GET)
    router.post(`/amend/:ovId/${step}`, requireAmendJourney, handler.POST)
  }
  amendStep('visit-type', visitType)
  amendStep('time-slot', timeSlot)
  amendStep('select-official-visitors', selectOfficialVisitors)
  amendStep('select-social-visitors', selectSocialVisitors)
  amendStep('assistance-required', assistanceRequired)
  amendStep('equipment', equipment)
  amendStep('comments', comments)

  return router
}
