// In-memory stand-in for the Official Visits API client + service. Returns a
// handful of fake visits so the view/manage screens have something to render.

export interface Prisoner {
  prisonerNumber: string
  firstName: string
  lastName: string
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

export default class OfficialVisitsService {
  // eslint-disable-next-line class-methods-use-this
  async getVisits(): Promise<OfficialVisit[]> {
    return dummyVisits
  }

  // eslint-disable-next-line class-methods-use-this
  async getVisit(officialVisitId: string): Promise<OfficialVisit | undefined> {
    return dummyVisits.find(v => v.officialVisitId === officialVisitId)
  }
}
