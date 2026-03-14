import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchIncidents } from '../../services/incidents';
import { fetchTriggers } from '../../services/triggers';
import { fetchMedications } from '../../services/medications';
import { fetchSymptoms } from '../../services/symptoms';
import { LocationsService } from '../../services/locations';
import {
  fetchWeights,
  fetchHeights,
  fetchBloodPressures,
  fetchSleeps,
  fetchWaters,
} from '../../services/health-logs';
import Loader from '../Loader';
import { Download } from 'lucide-react';

interface IDatabaseBackupFormProps {
  onSubmit: () => void;
}

export default function DatabaseBackupForm({ onSubmit }: IDatabaseBackupFormProps) {
  const { apiSession } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleBackup = async () => {
    if (!apiSession?.accessToken) {
      setErrorMessage('Session expired. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const token = apiSession.accessToken;

      const [
        incidents,
        triggers,
        medications,
        symptoms,
        locations,
        weights,
        heights,
        bloodPressures,
        sleeps,
        waters,
      ] = await Promise.all([
        fetchIncidents(token),
        fetchTriggers(token),
        fetchMedications(token),
        fetchSymptoms(token),
        LocationsService.getLocations(token),
        fetchWeights(token),
        fetchHeights(token),
        fetchBloodPressures(token),
        fetchSleeps(token),
        fetchWaters(token),
      ]);

      const backupData = {
        incidents,
        triggers,
        medications,
        symptoms,
        logsForecast: locations,
        healthLogs: {
          weights,
          heights,
          bloodPressures,
          sleeps,
          waters,
        },
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `migraine_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onSubmit();
    } catch (err) {
      setErrorMessage(
        'Error creating backup: ' + (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
          <Download className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database Backup</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Download a full copy of your data from the database. This includes all entries,
            summaries, and settings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader />
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">
            Fetching data from database...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleBackup}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            Download Backup JSON
          </button>
          <button
            onClick={onSubmit}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
