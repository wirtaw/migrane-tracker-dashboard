export const getIsoDate = (date: Date): string => date.toISOString().split('T')[0] || '';

export const getIsoTime = (date: Date): string => {
  let parts: string[] = [];
  parts = date.toISOString().split('T');

  if (parts[1]) {
    return parts[1].replace(':00.000Z', '') || '';
  }

  return '';
};

export const getIsoDateTimeLocal = (date: Date): string => {
  // Ensure the input is a valid Date object
  if (!(date instanceof Date)) {
    throw new Error('Invalid date provided. Please provide a valid Date object.');
  }

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  // Get the hours and minutes
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Construct the ISO datetime-local string
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
