import 'express-session'
import type { Prisoner } from '../services/officialVisitsService'
import type { Contact } from '../services/prisonerService'

// The in-progress "book an official visit" wizard state. In the real service
// this lives under a per-journey UUID in the URL; here we keep a single
// journey in the session to stay simple.
export interface OfficialVisitJourney {
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
  officialVisitors?: Contact[]
  staffNotes?: string
  prisonerNotes?: string
  // Track which optional pages have been visited so the guard can let the user
  // move forward (mirrors the real service's *PageCompleted flags).
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
