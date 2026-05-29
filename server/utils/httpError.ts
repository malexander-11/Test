// Minimal replacement for the `http-errors` package used by the real service.
export default function createError(status: number, message: string): Error & { status: number } {
  const error = new Error(message) as Error & { status: number }
  error.status = status
  return error
}
