import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'

dayjs.extend(dayOfYear)


/**
 * @returns
 * ```js
 * dayjs.Dayjs.format(day) // "Jan 01, 2022"
 * ```
 */
export function dF(day: dayjs.Dayjs) {
  return day.format('MMM DD, YYYY')
}

/** Get the days of the month */
export function getMonthDays(year: number, month: number) {
  return +dayjs().year(year).month(month).endOf('M').format('DD')
}

/** Get the day of the week on the first day of the month */
export function getMouthFirstDay(year: number, month: number) {
  return +dayjs().year(year).month(month).startOf('M').format('d')
}

export function getDateByDays(year: number): number
export function getDateByDays(year: number, days: number): dayjs.Dayjs
export function getDateByDays(year: number, days?: number) {
  return typeof(days)==='number'
    ? dayjs().year(year).dayOfYear(days)
    : dayjs().year(year).endOf('y').dayOfYear()
}

export function showWeek(week: string) {
  return ['Mon', 'Wed', 'Fri'].includes(week) ? week : null
}

export function getMouthColspan(year: number, month: number) {
  const days     = getMonthDays(year, month)
  const firstDay = getMouthFirstDay(year, month)
  return (
    Math.ceil((days - 7 + firstDay) / 7)
    + (month === 0 ? 1 : 0)
    + (firstDay === 0 && month !== 0 ? 1 : 0)
  )
}
