// Indian Timezone Utilities
// Handles proper timezone display for Indian users while maintaining UTC storage

// IST is UTC+5:30
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

/**
 * Formats a date to Indian Standard Time (IST)
 * @param date - Date to format (can be UTC timestamp from database)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string in IST
 */
export function formatToIST(
  date: string | Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = new Date(date);
  
  // Default options for Indian locale
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  };

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(dateObj);
}

/**
 * Formats a date to a more user-friendly format in IST
 * @param date - Date to format
 * @returns Human-readable date string
 */
export function formatDateForUser(date: string | Date | number): string {
  return formatToIST(date, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Formats a date for admin dashboards
 * @param date - Date to format
 * @returns Admin-friendly date string with seconds
 */
export function formatDateForAdmin(date: string | Date | number): string {
  return formatToIST(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Gets the current date/time in IST
 * @returns Current date in IST
 */
export function getCurrentIST(): Date {
  const now = new Date();
  return new Date(now.getTime() + IST_OFFSET);
}

/**
 * Converts UTC date to IST
 * @param utcDate - UTC date
 * @returns Date adjusted to IST
 */
export function convertUTCtoIST(utcDate: string | Date): Date {
  const date = new Date(utcDate);
  return new Date(date.getTime() + IST_OFFSET);
}

/**
 * Gets relative time string (e.g., "2 hours ago", "yesterday")
 * @param date - Date to compare
 * @returns Relative time string in Indian context
 */
export function getRelativeTime(date: string | Date | number): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // Convert to IST for relative calculations
  const istNow = getCurrentIST();
  const istTarget = convertUTCtoIST(targetDate);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatToIST(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

/**
 * Formats date for form display in IST
 * @param date - Date to format
 * @returns Date formatted for form inputs
 */
export function formatDateForForm(date: string | Date | number): string {
  const istDate = convertUTCtoIST(new Date(date));
  return istDate.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Validates that database timestamps are properly handled
 * @param timestamp - Database timestamp (should be UTC)
 * @returns Object with UTC and IST representations
 */
export function validateTimestamp(timestamp: string | Date | number) {
  const utcDate = new Date(timestamp);
  const istDate = convertUTCtoIST(utcDate);
  
  return {
    utc: utcDate.toISOString(),
    ist: formatToIST(utcDate),
    relative: getRelativeTime(utcDate),
    isValid: !isNaN(utcDate.getTime())
  };
}

// Export default formatter for common use
export const formatDate = formatToIST;