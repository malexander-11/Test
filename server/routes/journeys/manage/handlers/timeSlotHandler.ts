import { RequestHandler } from 'express'
import type { Services } from '../../../../services'
import { getOfficialVisit, stepsChecked } from '../journeyState'
import { formatDate, timeStringTo12HourPretty } from '../../../../utils/utils'

export default function timeSlotHandler({ officialVisitsService }: Services) {
  const toRadioItem = (slot: Awaited<ReturnType<typeof officialVisitsService.getAvailableSlots>>[number], selected?: string) => ({
    value: slot.timeSlotId,
    checked: slot.timeSlotId === selected,
    text: `${formatDate(slot.visitDate, 'EEEE, d MMMM yyyy')}, ${timeStringTo12HourPretty(slot.startTime)} to ${timeStringTo12HourPretty(slot.endTime)} — ${slot.locationDescription}`,
  })

  const GET: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const slots = await officialVisitsService.getAvailableSlots()
    res.render('pages/manage/timeSlot', {
      backUrl: '/manage/create/visit-type',
      prisoner: officialVisit.prisoner,
      stepsChecked: stepsChecked(officialVisit),
      items: slots.map(s => toRadioItem(s, officialVisit.selectedTimeSlot?.timeSlotId)),
    })
  }

  const POST: RequestHandler = async (req, res) => {
    const officialVisit = getOfficialVisit(req)
    const slots = await officialVisitsService.getAvailableSlots()
    const slot = slots.find(s => s.timeSlotId === req.body.timeSlot)
    if (!slot) {
      return res.render('pages/manage/timeSlot', {
        backUrl: '/manage/create/visit-type',
        prisoner: officialVisit.prisoner,
        stepsChecked: stepsChecked(officialVisit),
        items: slots.map(s => toRadioItem(s)),
        validationErrors: [{ field: 'timeSlot', message: 'Select a date and time for the visit' }],
      })
    }
    officialVisit.selectedTimeSlot = slot
    return res.redirect('/manage/create/select-visitors')
  }

  return { GET, POST }
}
