// In-memory stand-in for the Official Visits API client + service. Returns a
// handful of fake visits so the view/manage screens have something to render,
// and lets the booking journey "create" new ones (which then appear in the
// view list).
import type { OfficialVisitJourney } from '../interfaces/journey'

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
  visitDate: string // ISO yyyy-MM-dd
  startTime: string // HH:mm
  endTime: string // HH:mm
  locationDescription: string
  visitTypeDescription: string
  visitStatusDescription: string
  prisoner: Prisoner
  comments?: string
}

const dummyVisits: OfficialVisit[] = [
  {
    officialVisitId: 'a1b2c3',
    visitDate: '2026-06-02',
    startTime: '10:00',
    endTime: '11:00',
    locationDescription: 'Visits Hall 1',
    visitTypeDescription: 'Legal visit',
    visitStatusDescription: 'Booked',
    prisoner: { prisonerNumber: 'A1234BC', firstName: 'John', lastName: 'Smith' },
    comments: 'Solicitor meeting ahead of hearing.',
  },
  {
    officialVisitId: 'd4e5f6',
    visitDate: '2026-06-03',
    startTime: '14:30',
    endTime: '15:15',
    locationDescription: 'Legal Visits Room 2',
    visitTypeDescription: 'Police visit',
    visitStatusDescription: 'Booked',
    prisoner: { prisonerNumber: 'B2345CD', firstName: 'David', lastName: 'Jones' },
  },
  {
    officialVisitId: 'g7h8i9',
    visitDate: '2026-05-28',
    startTime: '09:15',
    endTime: '10:00',
    locationDescription: 'Visits Hall 1',
    visitTypeDescription: 'Embassy visit',
    visitStatusDescription: 'Completed',
    prisoner: { prisonerNumber: 'C3456DE', firstName: 'Michael', lastName: 'Brown' },
  },
]

const visitTypes: RefDataItem[] = [
  { code: 'LEGAL', description: 'Legal visit' },
  { code: 'POLICE', description: 'Police visit' },
  { code: 'EMBASSY', description: 'Embassy visit' },
  { code: 'VIDEO', description: 'Video link visit' },
]

const availableSlots: AvailableSlot[] = [
  {
    timeSlotId: 'TS1',
    visitDate: '2026-06-05',
    startTime: '09:00',
    endTime: '10:00',
    locationDescription: 'Visits Hall 1',
  },
  {
    timeSlotId: 'TS2',
    visitDate: '2026-06-05',
    startTime: '10:30',
    endTime: '11:30',
    locationDescription: 'Legal Visits Room 2',
  },
  {
    timeSlotId: 'TS3',
    visitDate: '2026-06-06',
    startTime: '14:00',
    endTime: '15:00',
    locationDescription: 'Visits Hall 1',
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
      visitDate: slot.visitDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      locationDescription: slot.locationDescription,
      visitTypeDescription: journey.visitTypeDescription!,
      visitStatusDescription: 'Booked',
      prisoner: journey.prisoner!,
      comments: journey.staffNotes,
    })
    return { officialVisitId }
  }
}
