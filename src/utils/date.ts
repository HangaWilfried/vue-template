import dayjs from "dayjs";
import { DateFormat } from "@/utils/enum.ts";

import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

/**
 * Converts a local date to UTC ISO string
 * @param localDate - Date in local timezone
 * @returns UTC ISO 8601 string (e.g., "2024-01-15T14:30:00Z")
 */
export const convertLocalDateToUtcIsoString = (
  localDate: string | Date
): string => {
  return dayjs(localDate).utc().format();
};

/**
 * Displays a UTC date in the user's local timezone
 * @param utcDate - UTC date to convert
 * @param format - Output format (default: YEAR_MONTH_DATE_TIME)
 * @returns Date formatted in local timezone
 */
export const getLocalDate = (
  utcDate: string | Date,
  format = DateFormat.YEAR_MONTH_DATE_TIME
): string => {
  // Automatic UTC → local timezone conversion
  return dayjs(utcDate).format(format);
};

/**
 * Displays a UTC date formatted (without timezone conversion)
 * @param utcDate - UTC date to format
 * @param format - Output format (default: YEAR_MONTH_DATE_TIME)
 * @returns Date formatted in UTC
 */
export const getUtcDate = (
  utcDate: string | Date,
  format = DateFormat.YEAR_MONTH_DATE_TIME
): string => {
  // Keeps the date in UTC for display
  return dayjs(utcDate).utc(true).format(format);
};

/**
 * Calculates relative time from a date to now
 * @param date - Reference date (UTC or local)
 * @returns Relative time (e.g., "2 hours ago", "in 3 days")
 */
export const getDateToNow = (date: string | Date): string => {
  // dayjs automatically handles comparison with current local time
  return dayjs(date).fromNow();
};

/**
 * Calculates relative time from a local date to now (in local timezone)
 * @param localDate - Local date reference
 * @returns Relative time calculated in local timezone
 */
export const getLocalDateToNow = (localDate: string | Date): string => {
  // Comparison local → local to avoid timezone shifts
  return dayjs(localDate).fromNow();
};

/**
 * Calculates relative time from a UTC date to now (in UTC)
 * @param utcDate - UTC date reference
 * @returns Relative time calculated in UTC
 */
export const getUtcDateToNow = (utcDate: string | Date): string => {
  // Comparison UTC → UTC to avoid timezone shifts
  return dayjs(utcDate).utc().fromNow();
};

// Additional utility functions for consistency

/**
 * Gets current date/time in UTC
 * @returns UTC ISO 8601 string of current moment
 */
export const getCurrentUtcDate = (): string => {
  return dayjs().utc().format();
};

/**
 * Gets current date/time in local timezone
 * @returns Current date/time in local timezone
 */
export const getCurrentLocalDate = (): string => {
  return dayjs().format();
};

/**
 * Checks if a date is in the past (local comparison)
 * @param date - Date to check
 * @returns true if date is in the past
 */
export const isDateInPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Checks if a local date is in the past (local comparison)
 * @param localDate - Local date to check
 * @returns true if local date is in the past
 */
export const isLocalDateInPast = (localDate: string | Date): boolean => {
  return dayjs(localDate).isBefore(dayjs());
};

/**
 * Checks if a UTC date is in the past (UTC comparison)
 * @param utcDate - UTC date to check
 * @returns true if UTC date is in the past
 */
export const isUtcDateInPast = (utcDate: string | Date): boolean => {
  return dayjs(utcDate).utc().isBefore(dayjs().utc());
};
