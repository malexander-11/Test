import OfficialVisitsService from './officialVisitsService'
import LocationsService from './locationsService'
import PrisonerService from './prisonerService'

export const services = () => ({
  officialVisitsService: new OfficialVisitsService(),
  locationsService: new LocationsService(),
  prisonerService: new PrisonerService(),
})

export type Services = ReturnType<typeof services>
