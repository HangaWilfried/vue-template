import dayjs from 'dayjs'
import { DateFormat } from '@/utils/enum.ts'

import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(relativeTime)

const locale = navigator.language.split('-')[0]
import(`dayjs/locale/${locale}`)
  .then(() => {
    dayjs.locale(locale)
  })
  .catch(() => {
    console.warn(`Locale ${locale} not found, falling back to 'en'`)
    dayjs.locale('en')
  })

export const convertLocalDateToUtcISOString = (localDate: Date): string => {
  return dayjs(localDate).utc().format()
}

export const convertUtcISOStringToLocalFormatted = (
  utcISOString: string,
  format = DateFormat.YEAR_MONTH_DATE_TIME,
): string => {
  return dayjs(utcISOString).format(format)
}

export const convertUtcISOStringToLocalRelative = (utcISOString: string): string => {
  return dayjs(utcISOString).fromNow()
}
