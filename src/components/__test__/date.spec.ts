import { describe, expect, it, vi } from 'vitest'
import {
  convertLocalDateToUtcISOString,
  convertUtcISOStringToLocalRelative,
  convertUtcISOStringToLocalFormatted,
} from '@/plugins/dateUtils.ts'

describe('Date Utils', () => {
  it('should convert a local Date to an ISO UTC string', () => {
    const localDate = new Date('2025-06-04T12:00:00')
    expect(convertLocalDateToUtcISOString(localDate)).toBe('2025-06-04T11:00:00Z')
  })

  it('should convert an ISO UTC string to a local formatted string', () => {
    const utcISOString = '2025-06-04T10:00:00Z'
    expect(convertUtcISOStringToLocalFormatted(utcISOString)).toBe('Jun 4, 2025 11:00 AM')
  })

  it('should convert an ISO UTC string to a relative local time string', () => {
    const fixedNow = new Date('2025-06-06T12:00:00Z')
    vi.setSystemTime(fixedNow)
    const twoDaysAgoUTC = new Date('2025-06-04T12:00:00Z').toISOString()
    expect(convertUtcISOStringToLocalRelative(twoDaysAgoUTC)).toBe('2 days ago')
    vi.useRealTimers()
  })
})
