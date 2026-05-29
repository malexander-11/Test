import 'express-session'
import type { Prisoner } from '../services/officialVisitsService'
import type { Contact } from '../services/prisonerService'

// A visitor on the journey is an approved contact plus the answers gathered
// about them on the assistance/equipment steps (mirrors the real
// JourneyVisitor type).
export interface JourneyVisitor extends Contact {
  assistedVisit?: boolean
  assistanceNotes?: string
  equipment?: boolean
  equipmentNotes?: string
}

// The in-progress "book an official visit" wizard state. In the real service
// this lives under a per-journey UUID in the URL; here we keep a single
// journey in the session to stay simple.
export interface OfficialVisitJourney {
  // Set when amending an existing visit so handlers know where to save to.
  officialVisitId?: string
  searchTerm?: string
  prisoner?: Prisoner
  visitType?: string
  visitTypeDescription?: string
  selectedTimeSlot?: {
    timeSlotId: string
    visitDate: string
    startTime: string
    endTime: string
    locationDescription: string
  }
  officialVisitors?: JourneyVisitor[]
  socialVisitors?: JourneyVisitor[]
  staffNotes?: string
  prisonerNotes?: string
  // Track which optional pages have been visited so the guard can let the user
  // move forward (mirrors the real service's *PageCompleted flags).
  socialVisitorsPageCompleted?: boolean
  assistancePageCompleted?: boolean
  equipmentPageCompleted?: boolean
  commentsPageCompleted?: boolean
}

export interface Journey {
  officialVisit?: OfficialVisitJourney
  journeyCompleted?: boolean
}

declare module 'express-session' {
  interface SessionData {
    journey?: Journey
  }
}
