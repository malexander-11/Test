// In-memory stand-in for the Prisoner Search API client + service.
import type { Prisoner } from './officialVisitsService'

const dummyPrisoners: Prisoner[] = [
  { prisonerNumber: 'A1234BC', firstName: 'John', lastName: 'Smith' },
  { prisonerNumber: 'B2345CD', firstName: 'David', lastName: 'Jones' },
  { prisonerNumber: 'C3456DE', firstName: 'Michael', lastName: 'Brown' },
  { prisonerNumber: 'D4567EF', firstName: 'Sarah', lastName: 'Williams' },
]

export default class PrisonerService {
  // eslint-disable-next-line class-methods-use-this
  async search(query: string): Promise<Prisoner[]> {
    if (!query) return dummyPrisoners
    const q = query.toLowerCase()
    return dummyPrisoners.filter(
      p =>
        p.prisonerNumber.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q),
    )
  }
}
