/**
 * Utilities for 12-hour / 24-hour time formatting and parsing
 */

/**
 * Parses time string ("11:30:00", "14:45", etc.) into 12-hour components.
 */
export function parseTimeTo12Hour(timeStr) {
  if (!timeStr) {
    return { hour: 11, minute: 0, period: 'AM' };
  }
  const parts = String(timeStr).trim().split(':');
  let h24 = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (isNaN(h24)) h24 = 11;
  if (isNaN(m)) m = 0;

  const period = h24 >= 12 ? 'PM' : 'AM';
  let hour = h24 % 12;
  if (hour === 0) hour = 12;

  return { hour, minute: m, period };
}

/**
 * Converts 12-hour components back into 24-hour "HH:MM:00" format.
 */
export function formatTo24Hour(hour, minute, period) {
  let h = parseInt(hour, 10);
  let m = parseInt(minute, 10);
  if (isNaN(h)) h = 12;
  if (isNaN(m)) m = 0;

  let h24 = h;
  if (period === 'AM') {
    h24 = h === 12 ? 0 : h;
  } else {
    h24 = h === 12 ? 12 : h + 12;
  }

  const hStr = String(h24).padStart(2, '0');
  const mStr = String(m).padStart(2, '0');
  return `${hStr}:${mStr}:00`;
}

/**
 * Formats time string to user-friendly "HH:MM AM/PM" (e.g. "11:00 AM").
 */
export function formatToDisplay12Hour(timeStr) {
  if (!timeStr) return '--:-- --';
  const { hour, minute, period } = parseTimeTo12Hour(timeStr);
  const hStr = String(hour).padStart(2, '0');
  const mStr = String(minute).padStart(2, '0');
  return `${hStr}:${mStr} ${period}`;
}

