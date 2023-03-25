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

export function getDateByDays(year: number, days: number) {
  return dayjs().year(year).dayOfYear(days)
}

export function log(...arg: any) {
  console.log(...arg)
}
