import { useState, useEffect } from 'react';
import { Pill, Check, Loader2 } from 'lucide-react';
import {
  getDailyMedications,
  getTodayLogs,
  toggleMedicationLog,
  DailyMedication,
} from '../../lib/daily-medications';
import { createMedication } from '../../services/medications';
import { useAuth } from '../../context/AuthContext';
import { useProfileDataContext } from '../../context/ProfileDataContext';

export default function EveryDayMedicationWidget() {
  const { apiSession } = useAuth();
  const { setMedicationList } = useProfileDataContext();
  const [medications, setMedications] = useState<DailyMedication[]>([]);
  const [takenIds, setTakenIds] = useState<string[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  useEffect(() => {
    setMedications(getDailyMedications());
    setTakenIds(getTodayLogs());
  }, []);

  const handleCreateMedication = async (med: DailyMedication) => {
    if (!apiSession?.accessToken || !apiSession?.userId) return;

    setLoadingIds(prev => [...prev, med.id]);
    try {
      const newMed = await createMedication(
        {
          userId: apiSession.userId,
          title: med.title,
          dosage: `${med.dosage}${med.unit}`,
          datetimeAt: med.time
            ? (() => {
                const now = new Date();
                const [hours, minutes] = med.time.split(':').map(Number);
                now.setHours(hours, minutes, 0, 0);
                return now.toISOString();
              })()
            : new Date().toISOString(),
          notes: 'Quick log from Dashboard',
        },
        apiSession.accessToken
      );

      setMedicationList(prev => [...prev, newMed]);

      // Update local storage log
      toggleMedicationLog(med.id);
      setTakenIds(prev => [...prev, med.id]);
    } catch (error) {
      console.error('Failed to quick log medication', error);
      // Ideally show a toast here
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== med.id));
    }
  };

  if (medications.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Medications</h2>
      </div>
      <div className="space-y-3">
        {medications.map(med => {
          const isTaken = takenIds.includes(med.id);
          const isLoading = loadingIds.includes(med.id);

          return (
            <div
              key={med.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isTaken
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-700'
              }`}
            >
              <div>
                <p
                  className={`font-medium ${isTaken ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}
                >
                  {med.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {med.dosage}
                  {med.unit}
                  {med.time && (
                    <span className="ml-2 text-indigo-500 font-medium">@ {med.time}</span>
                  )}
                </p>
              </div>

              {isTaken ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <span className="text-xs font-medium mr-1">Taken</span>
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <button
                  onClick={() => handleCreateMedication(med)}
                  disabled={isLoading}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-full transition-colors disabled:opacity-50"
                  aria-label={`Log ${med.title}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
