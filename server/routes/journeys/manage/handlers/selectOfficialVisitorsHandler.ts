import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import type { Contact } from '../../../../services/prisonerService'
import type { JourneyVisitor } from '../../../../interfaces/journey'
import { amendBaseUrl, getOfficialVisit, socialVisitorsEnabled, stepsChecked } from '../journeyState'

// Merge newly-selected contacts with any assistance/equipment answers already
// captured for them, so revisiting the page doesn't lose data.
const toVisitors = (chosen: Contact[], existing: JourneyVisitor[] = []): JourneyVisitor[] => {
  const prev = new Map(existing.map(v => [v.contactId, v]))
  return chosen.map(c => ({
    ...c,
    assistedVisit: prev.get(c.contactId)?.assistedVisit,
    assistanceNotes: prev.get(c.contactId)?.assistanceNotes,
    equipment: prev.get(c.contactId)?.equipment,
    equipmentNotes: prev.get(c.contactId)?.equipmentNotes,
  }))
}

export default function selectOfficialVisitorsHandler({ prisonerService, officialVisitsService }: Services) {
  const render = async (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1], selectedIds: string[], validationErrors?: unknown) => {
    const officialVisit = getOfficialVisit(req)
    const contacts = await prisonerService.getContacts(officialVisit.prisoner!.prisonerNumber, 'OFFICIAL')
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/selectOfficialVisitors', {
      backUrl: amend ? amendBaseUrl(req) : '/manage/create/time-slot',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items: contacts.map(c => ({
        value: c.contactId,
        text: `${c.firstName} ${c.lastName} (${c.relationshipDescription})`,
        checked: selectedIds.includes(c.contactId),
      })),
      validationErrors,
    })
  }

  const GET: RequestHandler = async (req, res) => {
    const selectedIds = (getOfficialVisit(req).officialVisitors ?? []).map(c => c.contactId)
    await render(req, res, selectedIds)
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const contacts = await prisonerService.getContacts(officialVisit.prisoner!.prisonerNumber, 'OFFICIAL')
    const submitted = [req.body.visitors].flat().filter(Boolean) as string[]
    const chosen = contacts.filter(c => submitted.includes(c.contactId))

    if (chosen.length === 0) {
      return render(req, res, [], [{ field: 'visitors', message: 'Select at least one official visitor' }])
    }

    officialVisit.officialVisitors = toVisitors(chosen, officialVisit.officialVisitors)

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        officialVisitors: officialVisit.officialVisitors,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect(
      socialVisitorsEnabled(officialVisit)
        ? '/manage/create/select-social-visitors'
        : '/manage/create/assistance-required',
    )
  }

  return { GET, POST }
}
