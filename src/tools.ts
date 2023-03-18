import dayjs from 'dayjs'


/**
 * @returns
 * ```js
 * dayjs.Dayjs.format(day) // "2023/01/01"
 * ```
 */
export function dF(day: dayjs.Dayjs) {
  return day.format('YYYY/MM/DD')
}

/** Get the days of the month */
export function getMonthDays(year: number, month: number) {
  return +dayjs().year(year).month(month).endOf('M').format('DD')
}

/** Get the day of the week on the first day of the month */
export function getMouthFirstDay(year: number, month: number) {
  return +dayjs().year(year).month(month).startOf('M').format('d')
}

export function log(...arg: any) {
  console.log(...arg)
}
