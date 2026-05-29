import express from 'express'
import session from 'express-session'
import nunjucksSetup from './utils/nunjucksSetup'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpFakeUser from './middleware/setUpFakeUser'
import createErrorHandler from './errorHandler'
import createError from './utils/httpError'
import config from './config'
import routes from './routes'
import type { Services } from './services'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', config.port)

  app.use(setUpHealthChecks())

  // In-memory session instead of Redis. Fine for a single-process dummy.
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
    }),
  )

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpFakeUser())
  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(createErrorHandler(config.production))

  return app
}
