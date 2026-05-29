import { format, parseISO } from 'date-fns'

export const convertToTitleCase = (sentence: string): string =>
  sentence
    .split(' ')
    .map(word => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ')

export const initialiseName = (fullName?: string): string | null => {
  if (!fullName) return null
  const [first, ...rest] = fullName.split(' ')
  return `${first[0]}. ${rest.slice(-1)}`
}

export const lastNameCommaFirstName = (person: { firstName: string; lastName: string }): string =>
  `${convertToTitleCase(person.lastName)}, ${convertToTitleCase(person.firstName)}`

export const firstNameSpaceLastName = (person: { firstName: string; lastName: string }): string =>
  `${convertToTitleCase(person.firstName)} ${convertToTitleCase(person.lastName)}`

// Accepts an ISO date (yyyy-MM-dd) and renders it the GOV.UK way.
export const formatDate = (isoDate?: string, pattern = 'd MMMM yyyy'): string => {
  if (!isoDate) return ''
  try {
    return format(parseISO(isoDate), pattern)
  } catch {
    return isoDate
  }
}

// Turns "13:30" into "1:30pm".
export const timeStringTo12HourPretty = (time?: string): string => {
  if (!time) return ''
  const [hStr, m] = time.split(':')
  const h = Number(hStr)
  const period = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m}${period}`
}
