// In-memory stand-in for the Official Visits API client + service. Returns a
// handful of fake visits so the view/manage screens have something to render,
// and lets the booking journey "create" and "amend" them (changes are visible
// in the view list).
import type { JourneyVisitor, OfficialVisitJourney } from '../interfaces/journey'

export interface Prisoner {
  prisonerNumber: string
  firstName: string
  lastName: string
}

export interface RefDataItem {
  code: string
  description: string
}

export interface AvailableSlot {
  timeSlotId: string
  visitDate: string // ISO yyyy-MM-dd
  startTime: string // HH:mm
  endTime: string // HH:mm
  locationDescription: string
}

export interface OfficialVisit {
  officialVisitId: string
  visitType: string // ref data code
  visitTypeDescription: string
  timeSlotId?: string
  visitDate: string // ISO yyyy-MM-dd
  startTime: string // HH:mm
  endTime: string // HH:mm
  locationDescription: string
  visitStatusDescription: string
  prisoner: Prisoner
  staffNotes?: string
  prisonerNotes?: string
  officialVisitors: JourneyVisitor[]
  socialVisitors: JourneyVisitor[]
}

const visitTypes: RefDataItem[] = [
  { code: 'LEGAL', description: 'Legal visit' },
  { code: 'POLICE', description: 'Police visit' },
  { code: 'EMBASSY', description: 'Embassy visit' },
  { code: 'VIDEO', description: 'Video link visit' },
]

const availableSlots: AvailableSlot[] = [
  { timeSlotId: 'TS1', visitDate: '2026-06-05', startTime: '09:00', endTime: '10:00', locationDescription: 'Visits Hall 1' },
  { timeSlotId: 'TS2', visitDate: '2026-06-05', startTime: '10:30', endTime: '11:30', locationDescription: 'Legal Visits Room 2' },
  { timeSlotId: 'TS3', visitDate: '2026-06-06', startTime: '14:00', endTime: '15:00', locationDescription: 'Visits Hall 1' },
]

const dummyVisits: OfficialVisit[] = [
  {
    officialVisitId: 'a1b2c3',
    visitType: 'LEGAL',
    visitTypeDescription: 'Legal visit',
    visitDate: '2026-06-02',
    startTime: '10:00',
    endTime: '11:00',
    locationDescription: 'Visits Hall 1',
    visitStatusDescription: 'Booked',
    prisoner: { prisonerNumber: 'A1234BC', firstName: 'John', lastName: 'Smith' },
    staffNotes: 'Solicitor meeting ahead of hearing.',
    officialVisitors: [
      { contactId: 'C1', firstName: 'Jane', lastName: 'Doe', relationshipDescription: 'Solicitor', relationshipType: 'OFFICIAL', assistedVisit: false },
    ],
    socialVisitors: [],
  },
  {
    officialVisitId: 'd4e5f6',
    visitType: 'POLICE',
    visitTypeDescription: 'Police visit',
    visitDate: '2026-06-03',
    startTime: '14:30',
    endTime: '15:15',
    locationDescription: 'Legal Visits Room 2',
    visitStatusDescription: 'Booked',
    prisoner: { prisonerNumber: 'B2345CD', firstName: 'David', lastName: 'Jones' },
    officialVisitors: [
      { contactId: 'C3', firstName: 'Amara', lastName: 'Okafor', relationshipDescription: 'Probation officer', relationshipType: 'OFFICIAL', assistedVisit: false },
    ],
    socialVisitors: [],
  },
  {
    officialVisitId: 'g7h8i9',
    visitType: 'EMBASSY',
    visitTypeDescription: 'Embassy visit',
    visitDate: '2026-05-28',
    startTime: '09:15',
    endTime: '10:00',
    locationDescription: 'Visits Hall 1',
    visitStatusDescription: 'Completed',
    prisoner: { prisonerNumber: 'C3456DE', firstName: 'Michael', lastName: 'Brown' },
    officialVisitors: [],
    socialVisitors: [],
  },
]

export default class OfficialVisitsService {
  // eslint-disable-next-line class-methods-use-this
  async getVisits(): Promise<OfficialVisit[]> {
    return dummyVisits
  }

  // eslint-disable-next-line class-methods-use-this
  async getVisit(officialVisitId: string): Promise<OfficialVisit | undefined> {
    return dummyVisits.find(v => v.officialVisitId === officialVisitId)
  }

  // eslint-disable-next-line class-methods-use-this
  async getVisitTypes(): Promise<RefDataItem[]> {
    return visitTypes
  }

  // eslint-disable-next-line class-methods-use-this
  async getAvailableSlots(): Promise<AvailableSlot[]> {
    return availableSlots
  }

  // Persists a booked visit from the journey state and returns its new id.
  // eslint-disable-next-line class-methods-use-this
  async createVisit(journey: OfficialVisitJourney): Promise<{ officialVisitId: string }> {
    const officialVisitId = `ov${Date.now().toString(36)}`
    const slot = journey.selectedTimeSlot!
    dummyVisits.push({
      officialVisitId,
      visitType: journey.visitType!,
      visitTypeDescription: journey.visitTypeDescription!,
      timeSlotId: slot.timeSlotId,
      visitDate: slot.visitDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      locationDescription: slot.locationDescription,
      visitStatusDescription: 'Booked',
      prisoner: journey.prisoner!,
      staffNotes: journey.staffNotes,
      prisonerNotes: journey.prisonerNotes,
      officialVisitors: journey.officialVisitors ?? [],
      socialVisitors: journey.socialVisitors ?? [],
    })
    return { officialVisitId }
  }

  // Applies a partial update to an existing visit (used by the amend journey).
  // eslint-disable-next-line class-methods-use-this
  async updateVisit(officialVisitId: string, changes: Partial<OfficialVisit>): Promise<void> {
    const visit = dummyVisits.find(v => v.officialVisitId === officialVisitId)
    if (visit) Object.assign(visit, changes)
  }
}
