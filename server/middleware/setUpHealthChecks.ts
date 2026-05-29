import express, { Router } from 'express'

// The real service exposes /health, /ping, /info backed by hmpps-monitoring
// and checks every downstream API. The dummy has no downstreams, so these
// always report healthy.
export default function setUpHealthChecks(): Router {
  const router = express.Router()

  const ok = (res: express.Response) => res.json({ status: 'UP', timestamp: new Date().toISOString() })

  router.get('/health', (req, res) => ok(res))
  router.get('/ping', (req, res) => res.json({ status: 'UP' }))
  router.get('/info', (req, res) => res.json({ build: { name: 'hmpps-official-visits-ui-dummy', version: '0.0.1' } }))

  return router
}
