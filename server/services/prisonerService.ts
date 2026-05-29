// In-memory stand-in for the Prisoner Search + Personal Relationships API
// clients. Provides prisoner search and the prisoner's approved contacts.
import type { Prisoner } from './officialVisitsService'

export interface Contact {
  contactId: string
  firstName: string
  lastName: string
  relationshipDescription: string
}

const dummyPrisoners: Prisoner[] = [
  { prisonerNumber: 'A1234BC', firstName: 'John', lastName: 'Smith' },
  { prisonerNumber: 'B2345CD', firstName: 'David', lastName: 'Jones' },
  { prisonerNumber: 'C3456DE', firstName: 'Michael', lastName: 'Brown' },
  { prisonerNumber: 'D4567EF', firstName: 'Sarah', lastName: 'Williams' },
]

const dummyContacts: Record<string, Contact[]> = {
  default: [
    { contactId: 'C1', firstName: 'Jane', lastName: 'Doe', relationshipDescription: 'Solicitor' },
    { contactId: 'C2', firstName: 'Robert', lastName: 'Hughes', relationshipDescription: 'Legal representative' },
    { contactId: 'C3', firstName: 'Amara', lastName: 'Okafor', relationshipDescription: 'Probation officer' },
  ],
}

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

  // eslint-disable-next-line class-methods-use-this
  async getPrisoner(prisonerNumber: string): Promise<Prisoner | undefined> {
    return dummyPrisoners.find(p => p.prisonerNumber === prisonerNumber)
  }

  // eslint-disable-next-line class-methods-use-this
  async getApprovedContacts(_prisonerNumber: string): Promise<Contact[]> {
    return dummyContacts.default
  }
}
