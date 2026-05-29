/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import config from '../config'
import { Permission } from '../interfaces/hmppsUser'
import {
  convertToTitleCase,
  firstNameSpaceLastName,
  formatDate,
  initialiseName,
  lastNameCommaFirstName,
  timeStringTo12HourPretty,
} from './utils'

interface FieldValidationError {
  field: string
  message: string
}

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = config.applicationName
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = 'govuk-tag--orange'
  app.locals.digitalPrisonServicesUrl = config.serviceUrls.digitalPrison
  app.locals.prisonerProfileUrl = config.serviceUrls.prisonerProfile
  app.locals.PERMISSION = Permission

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('convertToTitleCase', convertToTitleCase)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('timeStringTo12HourPretty', timeStringTo12HourPretty)
  njkEnv.addFilter('lastNameCommaFirstName', lastNameCommaFirstName)
  njkEnv.addFilter('firstNameSpaceLastName', firstNameSpaceLastName)
  njkEnv.addFilter('findError', (errors: FieldValidationError[], field: string) =>
    errors?.find(e => e.field === field),
  )
  njkEnv.addFilter('hasPermission', (user: { permissions?: Permission[] }, permission: Permission) =>
    Boolean(user?.permissions?.includes(permission)),
  )
  njkEnv.addFilter('filterNonFalsy', (items: unknown[]) => items.filter(Boolean))
  // The real build produces a hashed asset manifest; in the dummy assets are
  // served at stable paths, so assetMap is just a passthrough.
  njkEnv.addFilter('assetMap', (url: string) => url)
}
