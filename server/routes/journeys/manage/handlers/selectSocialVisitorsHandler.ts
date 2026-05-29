import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import type { Contact } from '../../../../services/prisonerService'
import type { JourneyVisitor } from '../../../../interfaces/journey'
import { amendBaseUrl, getOfficialVisit, stepsChecked } from '../journeyState'

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

export default function selectSocialVisitorsHandler({ prisonerService, officialVisitsService }: Services) {
  const render = async (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1], selectedIds: string[]) => {
    const officialVisit = getOfficialVisit(req)
    const contacts = await prisonerService.getContacts(officialVisit.prisoner!.prisonerNumber, 'SOCIAL')
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/selectSocialVisitors', {
      backUrl: amend ? amendBaseUrl(req) : '/manage/create/select-official-visitors',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items: contacts.map(c => ({
        value: c.contactId,
        text: `${c.firstName} ${c.lastName} (${c.relationshipDescription})`,
        checked: selectedIds.includes(c.contactId),
      })),
    })
  }

  const GET: RequestHandler = async (req, res) => {
    const selectedIds = (getOfficialVisit(req).socialVisitors ?? []).map(c => c.contactId)
    await render(req, res, selectedIds)
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const contacts = await prisonerService.getContacts(officialVisit.prisoner!.prisonerNumber, 'SOCIAL')
    const submitted = [req.body.visitors].flat().filter(Boolean) as string[]
    // Social visitors are optional, so an empty selection is allowed.
    const chosen = contacts.filter(c => submitted.includes(c.contactId))
    officialVisit.socialVisitors = toVisitors(chosen, officialVisit.socialVisitors)
    officialVisit.socialVisitorsPageCompleted = true

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        socialVisitors: officialVisit.socialVisitors,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect('/manage/create/assistance-required')
  }

  return { GET, POST }
}
