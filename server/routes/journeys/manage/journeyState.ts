import { Request, RequestHandler } from 'express'
import config from '../../../config'
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

// Whether the social-visitors step applies: gated by a feature toggle and only
// once at least one official visitor has been chosen (mirrors the real rule).
export const socialVisitorsEnabled = (j: OfficialVisitJourney): boolean =>
  config.featureToggles.allowSocialVisitors && (j.officialVisitors?.length ?? 0) > 0

// The equipment step only applies to in-person visits (video visits skip it).
export const equipmentEnabled = (j: OfficialVisitJourney): boolean => j.visitType !== 'VIDEO'

// All the selected visitors (official + social).
export const allVisitors = (j: OfficialVisitJourney) => [
  ...(j.officialVisitors ?? []),
  ...(j.socialVisitors ?? []),
]

// Mirrors the real service's JourneyStateGuard: if a step's prerequisites
// aren't met, push the user back to the earliest incomplete step. This is a
// "last resort" guard — normal forward navigation is done by the handlers.
const guards: Record<string, (j: OfficialVisitJourney) => string | undefined> = {
  results: j => (j.searchTerm ? undefined : `${BASE}/search`),
  'visit-type': j => (j.prisoner ? undefined : `${BASE}/results`),
  'time-slot': j => (j.visitType ? undefined : `${BASE}/visit-type`),
  'select-official-visitors': j => (j.selectedTimeSlot ? undefined : `${BASE}/time-slot`),
  'select-social-visitors': j => {
    if (!j.officialVisitors?.length) return `${BASE}/select-official-visitors`
    if (!socialVisitorsEnabled(j)) return `${BASE}/assistance-required`
    return undefined
  },
  'assistance-required': j => {
    if (socialVisitorsEnabled(j)) {
      return j.socialVisitorsPageCompleted ? undefined : `${BASE}/select-social-visitors`
    }
    return j.officialVisitors?.length ? undefined : `${BASE}/select-official-visitors`
  },
  equipment: j => {
    if (!j.assistancePageCompleted) return `${BASE}/assistance-required`
    return equipmentEnabled(j) ? undefined : `${BASE}/comments`
  },
  comments: j => {
    if (equipmentEnabled(j)) return j.equipmentPageCompleted ? undefined : `${BASE}/equipment`
    return j.assistancePageCompleted ? undefined : `${BASE}/assistance-required`
  },
  'check-your-answers': j => (j.commentsPageCompleted ? undefined : `${BASE}/comments`),
}

export const requireStep =
  (step: string): RequestHandler =>
  (req, res, next) => {
    const redirect = guards[step]?.(req.session.journey?.officialVisit ?? {})
    if (redirect) return res.redirect(redirect)
    return next()
  }

// ---- Amend mode -------------------------------------------------------------

export const amendBaseUrl = (req: Request): string => `/manage/amend/${req.params.ovId}`

// Ensures the hydrated journey belongs to the visit being amended; if not (e.g.
// the user deep-linked to a step), bounce back to the landing page which
// re-hydrates from the stored visit.
export const requireAmendJourney: RequestHandler = (req, res, next) => {
  if (req.session.journey?.officialVisit?.officialVisitId === req.params.ovId) return next()
  return res.redirect(amendBaseUrl(req))
}

// ---- Progress tracker -------------------------------------------------------

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
