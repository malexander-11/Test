import { Request, RequestHandler } from 'express'
import type { Journey, OfficialVisitJourney } from '../../../interfaces/journey'

const BASE = '/manage/create'

// Ensures the journey container exists on the session for every step.
export const ensureJourney: RequestHandler = (req, res, next) => {
  req.session.journey ??= {}
  req.session.journey.officialVisit ??= {}
  next()
}

// Accessors that assume ensureJourney has run, so handlers don't have to deal
// with the "possibly undefined" session types on every line.
export const getJourney = (req: Request): Journey => req.session.journey as Journey
export const getOfficialVisit = (req: Request): OfficialVisitJourney =>
  (req.session.journey as Journey).officialVisit as OfficialVisitJourney

// Mirrors the real service's JourneyStateGuard: if a step's prerequisites
// aren't met, push the user back to the earliest incomplete step. This is a
// "last resort" guard — normal forward navigation is done by the handlers.
const guards: Record<string, (j: OfficialVisitJourney) => string | undefined> = {
  results: j => (j.searchTerm ? undefined : `${BASE}/search`),
  'visit-type': j => (j.prisoner ? undefined : `${BASE}/results`),
  'time-slot': j => (j.visitType ? undefined : `${BASE}/visit-type`),
  'select-visitors': j => (j.selectedTimeSlot ? undefined : `${BASE}/time-slot`),
  comments: j => (j.officialVisitors?.length ? undefined : `${BASE}/select-visitors`),
  'check-your-answers': j => (j.commentsPageCompleted ? undefined : `${BASE}/comments`),
}

export const requireStep =
  (step: string): RequestHandler =>
  (req, res, next) => {
    const redirect = guards[step]?.(req.session.journey?.officialVisit ?? {})
    if (redirect) return res.redirect(redirect)
    return next()
  }

// How many milestones are complete, used to drive the progress tracker.
export const stepsChecked = (j: OfficialVisitJourney = {}): number => {
  let n = 0
  if (j.prisoner) n += 1
  if (j.visitType) n += 1
  if (j.selectedTimeSlot) n += 1
  if (j.officialVisitors?.length) n += 1
  if (j.commentsPageCompleted) n += 1
  return n
}
