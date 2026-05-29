// In-memory stand-in for the Prisoner Search + Personal Relationships API
// clients. Provides prisoner search and the prisoner's approved contacts,
// split into official and social relationships.
import type { Prisoner } from './officialVisitsService'

export type RelationshipType = 'OFFICIAL' | 'SOCIAL'

export interface Contact {
  contactId: string
  firstName: string
  lastName: string
  relationshipDescription: string
  relationshipType: RelationshipType
}

const dummyPrisoners: Prisoner[] = [
  { prisonerNumber: 'A1234BC', firstName: 'John', lastName: 'Smith' },
  { prisonerNumber: 'B2345CD', firstName: 'David', lastName: 'Jones' },
  { prisonerNumber: 'C3456DE', firstName: 'Michael', lastName: 'Brown' },
  { prisonerNumber: 'D4567EF', firstName: 'Sarah', lastName: 'Williams' },
]

const dummyContacts: Contact[] = [
  { contactId: 'C1', firstName: 'Jane', lastName: 'Doe', relationshipDescription: 'Solicitor', relationshipType: 'OFFICIAL' },
  { contactId: 'C2', firstName: 'Robert', lastName: 'Hughes', relationshipDescription: 'Legal representative', relationshipType: 'OFFICIAL' },
  { contactId: 'C3', firstName: 'Amara', lastName: 'Okafor', relationshipDescription: 'Probation officer', relationshipType: 'OFFICIAL' },
  { contactId: 'C4', firstName: 'Mary', lastName: 'Smith', relationshipDescription: 'Mother', relationshipType: 'SOCIAL' },
  { contactId: 'C5', firstName: 'Peter', lastName: 'Smith', relationshipDescription: 'Brother', relationshipType: 'SOCIAL' },
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

  // eslint-disable-next-line class-methods-use-this
  async getPrisoner(prisonerNumber: string): Promise<Prisoner | undefined> {
    return dummyPrisoners.find(p => p.prisonerNumber === prisonerNumber)
  }

  // eslint-disable-next-line class-methods-use-this
  async getContacts(_prisonerNumber: string, relationshipType: RelationshipType): Promise<Contact[]> {
    return dummyContacts.filter(c => c.relationshipType === relationshipType)
  }
}
