// In-memory stand-in for the Locations Inside Prison API client + service.

export interface Location {
  locationId: string
  locationName: string
  enabled: boolean
}

const dummyLocations: Location[] = [
  { locationId: 'LOC1', locationName: 'Visits Hall 1', enabled: true },
  { locationId: 'LOC2', locationName: 'Legal Visits Room 2', enabled: true },
  { locationId: 'LOC3', locationName: 'Video Link Room A', enabled: false },
]

export default class LocationsService {
  // eslint-disable-next-line class-methods-use-this
  async getLocations(): Promise<Location[]> {
    return dummyLocations
  }
}
