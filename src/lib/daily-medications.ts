export interface DailyMedication {
  id: string; // UUID or unique string
  title: string;
  dosage: string;
  unit: string;
  time?: string;
}

const SETTINGS_KEY = 'dailyMedications';
const LOG_PREFIX = 'dailyMedicationLog_';

export function getDailyMedications(): DailyMedication[] {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse daily medications', e);
    return [];
  }
}

export function saveDailyMedications(meds: DailyMedication[]): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(meds));
}

export function addDailyMedication(med: Omit<DailyMedication, 'id'>): DailyMedication[] {
  const current = getDailyMedications();
  const newMed = { ...med, id: crypto.randomUUID() };
  const updated = [...current, newMed];
  saveDailyMedications(updated);
  return updated;
}

export function removeDailyMedication(id: string): DailyMedication[] {
  const current = getDailyMedications();
  const updated = current.filter(m => m.id !== id);
  saveDailyMedications(updated);
  return updated;
}

export function getTodayLogKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `${LOG_PREFIX}${today}`;
}

export function getMedicationLogsForDate(dateStr: string): string[] {
  try {
    const key = `${LOG_PREFIX}${dateStr}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Returns a list of medication IDs that have been taken today.
 */
export function getTodayLogs(): string[] {
  const today = new Date().toISOString().split('T')[0];
  return getMedicationLogsForDate(today);
}

export function toggleMedicationLog(medId: string): boolean {
  const key = getTodayLogKey();
  const logs = getTodayLogs();
  const isLogged = logs.includes(medId);

  let newLogs;
  if (isLogged) {
    newLogs = logs.filter(id => id !== medId);
  } else {
    newLogs = [...logs, medId];
  }

  localStorage.setItem(key, JSON.stringify(newLogs));
  return !isLogged;
}
