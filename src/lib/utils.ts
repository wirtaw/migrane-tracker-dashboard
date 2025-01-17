export const getIsoDate = (date: Date): string => date.toISOString().split('T')[0] || '';
