import { RequestHandler } from 'express'
import { HmppsUser, Permission } from '../interfaces/hmppsUser'

// The real service authenticates against HMPPS Auth via passport-oauth2 and
// derives permissions from the user's roles. For the dummy we just inject a
// fixed signed-in user with every permission so all journeys are reachable.
const dummyUser: HmppsUser = {
  username: 'DUMMY_USER',
  name: 'Dummy User',
  displayName: 'Dummy User',
  activeCaseLoadId: 'LEI',
  permissions: [Permission.DEFAULT, Permission.VIEW, Permission.MANAGE, Permission.ADMIN],
}

export default function setUpFakeUser(): RequestHandler {
  return (req, res, next) => {
    res.locals.user = dummyUser
    next()
  }
}
