import type { NextFunction, Request, Response } from 'express'
import logger from './logger'

interface HttpError extends Error {
  status?: number
}

export default function createErrorHandler(production: boolean) {
  return (error: HttpError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error.message)

    const status = error.status || 500
    res.status(status)
    res.render('pages/error', {
      message: production ? 'Something went wrong. The error has been logged.' : error.message,
      status,
      stack: production ? null : error.stack,
    })
  }
}
