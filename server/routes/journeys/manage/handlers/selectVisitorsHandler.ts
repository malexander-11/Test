import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { getOfficialVisit, stepsChecked } from '../journeyState'

export default function selectVisitorsHandler({ prisonerService }: Services) {
  const toCheckboxItem = (
    contact: Awaited<ReturnType<typeof prisonerService.getApprovedContacts>>[number],
    selectedIds: string[],
  ) => ({
    value: contact.contactId,
    text: `${contact.firstName} ${contact.lastName} (${contact.relationshipDescription})`,
    checked: selectedIds.includes(contact.contactId),
  })

  const GET: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const contacts = await prisonerService.getApprovedContacts(officialVisit.prisoner!.prisonerNumber)
    const selectedIds = (officialVisit.officialVisitors || []).map(c => c.contactId)
    res.render('pages/manage/selectVisitors', {
      backUrl: '/manage/create/time-slot',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items: contacts.map(c => toCheckboxItem(c, selectedIds)),
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const contacts = await prisonerService.getApprovedContacts(officialVisit.prisoner!.prisonerNumber)
    const submitted = [req.body.visitors].flat().filter(Boolean)
    const chosen = contacts.filter(c => submitted.includes(c.contactId))

    if (chosen.length === 0) {
      return res.render('pages/manage/selectVisitors', {
        backUrl: '/manage/create/time-slot',
        prisoner: officialVisit.prisoner,
        stepsChecked: stepsChecked(officialVisit),
        items: contacts.map(c => toCheckboxItem(c, [])),
        validationErrors: [{ field: 'visitors', message: 'Select at least one visitor' }],
      })
    }

    officialVisit.officialVisitors = chosen
    return res.redirect('/manage/create/comments')
  }

  return { GET, POST }
}
