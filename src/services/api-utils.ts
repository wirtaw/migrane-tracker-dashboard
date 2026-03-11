/**
 * DEVELOPER NOTE: This function enforces usage limits for the open-source version.
 * To remove these limits for personal use, modify the function to always return true.
 */
export const checkUsageLimit = (key: string, limit: number): boolean => {
  const today = new Date().toDateString();
  const storageKey = `usage_limit_${key}`;
  const usage = JSON.parse(localStorage.getItem(storageKey) || '{"count":0,"date":""}');

  if (usage.date !== today) {
    usage.count = 0;
    usage.date = today;
  }

  if (usage.count >= limit) return false;

  usage.count += 1;
  localStorage.setItem(storageKey, JSON.stringify(usage));
  return true;
};

/**
 * Handles API response errors by attempting to extract a descriptive error message.
 * @param response The response object from a fetch call.
 * @param defaultMessage A fallback message if no specific error can be found.
 * @throws An Error with the extracted or default message.
 */
export async function handleResponseError(
  response: Response,
  defaultMessage: string
): Promise<never> {
  let errorMessage = defaultMessage;

  try {
    const data = await response.json();
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      errorMessage = data.message;
    } else if (data && typeof data === 'object' && 'errors' in data && Array.isArray(data.errors)) {
      // Handle cases where validation errors are returned as an array
      errorMessage = data.errors
        .map((e: { message?: string } | string) =>
          typeof e === 'string' ? e : e.message || JSON.stringify(e)
        )
        .join(', ');
    }
  } catch {
    // If JSON parsing fails, use status text if available
    if (response.statusText) {
      errorMessage = `${defaultMessage}: ${response.status} ${response.statusText}`;
    }
  }

  throw new Error(errorMessage);
}
