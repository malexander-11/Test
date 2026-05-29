// Simplified config for the dummy service. The real service reads dozens of
// env vars for HMPPS Auth, Redis, and a handful of backend APIs. Here we only
// keep what the standalone skeleton actually needs, with sensible local
// defaults so it runs with zero configuration.
const production = process.env.NODE_ENV === 'production'

export default {
  production,
  port: Number(process.env.PORT) || 3000,
  applicationName: 'Manage Official Visits',
  environmentName: process.env.ENVIRONMENT_NAME || 'LOCAL (DUMMY)',
  session: {
    secret: process.env.SESSION_SECRET || 'dummy-insecure-session-secret',
  },
  // These would normally point at other DPS services. Kept as harmless
  // localhost placeholders so links render without breaking.
  serviceUrls: {
    digitalPrison: process.env.DPS_HOME_PAGE_URL || 'http://localhost:3001',
    prisonerProfile: process.env.PRISONER_PROFILE_URL || 'http://localhost:3001',
  },
}
