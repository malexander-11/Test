import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import type { AvailableSlot } from '../../../../services/officialVisitsService'
import { amendBaseUrl, getOfficialVisit, stepsChecked } from '../journeyState'
import { formatDate, timeStringTo12HourPretty } from '../../../../utils/utils'

export default function timeSlotHandler({ officialVisitsService }: Services) {
  const toRadioItem = (slot: AvailableSlot, selected?: string) => ({
    value: slot.timeSlotId,
    checked: slot.timeSlotId === selected,
    text: `${formatDate(slot.visitDate, 'EEEE, d MMMM yyyy')}, ${timeStringTo12HourPretty(slot.startTime)} to ${timeStringTo12HourPretty(slot.endTime)} — ${slot.locationDescription}`,
  })

  const render = (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1], items: unknown, validationErrors?: unknown) => {
    const officialVisit = getOfficialVisit(req)
    const amend = res.locals.mode === 'amend'
    res.render('pages/manage/timeSlot', {
      backUrl: amend ? amendBaseUrl(req) : '/manage/create/visit-type',
      submitText: amend ? 'Save' : 'Continue',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items,
      validationErrors,
    })
  }

  const GET: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const slots = await officialVisitsService.getAvailableSlots()
    render(req, res, slots.map(s => toRadioItem(s, officialVisit.selectedTimeSlot?.timeSlotId)))
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const slots = await officialVisitsService.getAvailableSlots()
    const slot = slots.find(s => s.timeSlotId === req.body.timeSlot)
    if (!slot) {
      return render(req, res, slots.map(s => toRadioItem(s)), [
        { field: 'timeSlot', message: 'Select a date and time for the visit' },
      ])
    }
    officialVisit.selectedTimeSlot = slot

    if (res.locals.mode === 'amend') {
      await officialVisitsService.updateVisit(officialVisit.officialVisitId!, {
        timeSlotId: slot.timeSlotId,
        visitDate: slot.visitDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        locationDescription: slot.locationDescription,
      })
      return res.redirect(amendBaseUrl(req))
    }
    return res.redirect('/manage/create/select-official-visitors')
  }

  return { GET, POST }
}
