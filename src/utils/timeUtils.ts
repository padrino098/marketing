// ─────────────────────────────────────────────────────────────────
//  src/utils/timeUtils.ts
//  Helpers for parsing and formatting time values.
// ─────────────────────────────────────────────────────────────────

/**
 * Converts a 12-hour time string (e.g. "02:30 PM") to a decimal hour
 * value (e.g. 14.5).  Returns null if the string cannot be parsed.
 */
export const parseTimeToDecimal = (timeStr: string): number | null => {
  if (!timeStr) return null;

  // "02:30 PM" or "02:30 AM"
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours + minutes / 60;
  }

  // 24-hour "14:30"
  const match24 = timeStr.match(/(\d+):(\d+)/);
  if (match24) {
    return parseInt(match24[1], 10) + parseInt(match24[2], 10) / 60;
  }

  // Simple "2 PM"
  const simpleMatch = timeStr.match(/(\d+)\s*(AM|PM)/i);
  if (simpleMatch) {
    let hours = parseInt(simpleMatch[1], 10);
    const ampm = simpleMatch[2].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours;
  }

  return null;
};

/**
 * Converts a decimal hour value (e.g. 14.5) back to a 12-hour string
 * (e.g. "02:30 PM").
 */
export const formatDecimalToTime = (decimalHours: number): string => {
  const hoursInt = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hoursInt) * 60);
  const ampm = hoursInt >= 12 ? 'PM' : 'AM';
  let hours12 = hoursInt % 12;
  if (hours12 === 0) hours12 = 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

/**
 * Formats a total-seconds value as a MM:SS timecode string.
 */
export const formatTimecode = (secs: number): string => {
  const minutes = Math.floor(secs / 60);
  const remainingSeconds = secs % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
