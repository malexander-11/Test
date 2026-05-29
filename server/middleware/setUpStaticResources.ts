import path from 'path'
import express, { Router } from 'express'

// Serves the front-end assets. The real service bundles everything with
// esbuild + sass; the dummy keeps it simple and serves the pre-compiled CSS/JS
// straight out of node_modules, plus our own small public/ overrides.
//
// govuk-frontend's compiled CSS expects fonts at /assets/fonts and images at
// /assets/images, so the govuk "assets" folder is mounted at /assets.
export default function setUpStaticResources(): Router {
  const router = express.Router()

  const govukFrontend = path.dirname(require.resolve('govuk-frontend/package.json'))
  const mojFrontend = path.dirname(require.resolve('@ministryofjustice/frontend/package.json'))

  // Our own overrides (css/js/images) take precedence.
  router.use('/assets', express.static(path.join(__dirname, '../../public/assets')))

  // GOV.UK fonts + images at the path the compiled CSS references.
  router.use('/assets', express.static(path.join(govukFrontend, 'dist/govuk/assets')))

  // GOV.UK compiled CSS + JS.
  router.use('/assets/govuk', express.static(path.join(govukFrontend, 'dist/govuk')))

  // MoJ Frontend compiled CSS + JS.
  router.use('/assets/moj', express.static(path.join(mojFrontend, 'moj')))

  return router
}
