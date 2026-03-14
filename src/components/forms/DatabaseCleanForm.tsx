import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchIncidents, deleteIncident } from '../../services/incidents';
import { fetchTriggers, deleteTrigger } from '../../services/triggers';
import { fetchMedications, deleteMedication } from '../../services/medications';
import { fetchSymptoms, deleteSymptom } from '../../services/symptoms';
import { LocationsService } from '../../services/locations';
import {
  fetchWeights,
  deleteWeight,
  fetchHeights,
  deleteHeight,
  fetchBloodPressures,
  deleteBloodPressure,
  fetchSleeps,
  deleteSleep,
  fetchWaters,
  deleteWater,
} from '../../services/health-logs';
import Loader from '../Loader';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface IDatabaseCleanFormProps {
  onSubmit: () => void;
}

interface IDeleteItem {
  id: string;
  type: string;
  deleteFn: (id: string, token: string) => Promise<void>;
}

export default function DatabaseCleanForm({ onSubmit }: IDatabaseCleanFormProps) {
  const { apiSession } = useAuth();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [currentType, setCurrentType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('');

  const handleClean = async () => {
    if (confirmText !== 'DELETE ALL') {
      setErrorMessage('Please type "DELETE ALL" to confirm.');
      return;
    }

    if (!apiSession?.accessToken) {
      setErrorMessage('Session expired. Please log in again.');
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage('');
      const token = apiSession.accessToken;

      // 1. Fetch all items to get their IDs
      setCurrentType('Fetching items...');
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

      const allItems: IDeleteItem[] = [
        ...incidents.map(item => ({
          id: item.id.toString(),
          type: 'Incident',
          deleteFn: (id: string, t: string) => deleteIncident(id, t),
        })),
        ...triggers.map(item => ({
          id: item.id.toString(),
          type: 'Trigger',
          deleteFn: (id: string, t: string) => deleteTrigger(id, t),
        })),
        ...medications.map(item => ({
          id: item.id.toString(),
          type: 'Medication',
          deleteFn: (id: string, t: string) => deleteMedication(id, t),
        })),
        ...symptoms.map(item => ({
          id: item.id.toString(),
          type: 'Symptom',
          deleteFn: (id: string, t: string) => deleteSymptom(id, t),
        })),
        ...locations.map(item => ({
          id: item.id.toString(),
          type: 'Location',
          deleteFn: (id: string, t: string) => LocationsService.deleteLocation(t, id),
        })),
        ...weights.map(item => ({
          id: item.id.toString(),
          type: 'Weight',
          deleteFn: (id: string, t: string) => deleteWeight(id, t),
        })),
        ...heights.map(item => ({
          id: item.id.toString(),
          type: 'Height',
          deleteFn: (id: string, t: string) => deleteHeight(id, t),
        })),
        ...bloodPressures.map(item => ({
          id: item.id.toString(),
          type: 'Blood Pressure',
          deleteFn: (id: string, t: string) => deleteBloodPressure(id, t),
        })),
        ...sleeps.map(item => ({
          id: item.id.toString(),
          type: 'Sleep',
          deleteFn: (id: string, t: string) => deleteSleep(id, t),
        })),
        ...waters.map(item => ({
          id: item.id.toString(),
          type: 'Waters',
          deleteFn: (id: string, t: string) => deleteWater(id, t),
        })),
      ];

      setProgress({ current: 0, total: allItems.length });

      // 2. Delete items sequentially
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        setCurrentType(`Deleting ${item.type} (${i + 1}/${allItems.length})`);
        try {
          await item.deleteFn(item.id, token);
          setProgress(prev => ({ ...prev, current: i + 1 }));
        } catch (err) {
          console.error(`Failed to delete ${item.type} with ID ${item.id}:`, err);
          // Continue with others even if one fails
        }
      }

      onSubmit();
    } catch (err) {
      setErrorMessage(
        'Error cleaning database: ' + (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300">DANGEROUS ACTION</h3>
        </div>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          This will permanently delete ALL your data from the database. This action cannot be
          undone. We strongly recommend making a backup first.
        </p>
      </div>

      {!isDeleting ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type <span className="font-bold">DELETE ALL</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="DELETE ALL"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleClean}
              disabled={confirmText !== 'DELETE ALL'}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-lg shadow-lg transition-all duration-300 ${
                confirmText === 'DELETE ALL'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              Clean All Database Data
            </button>
            <button
              onClick={onSubmit}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <Loader />
          <div className="text-center space-y-2">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 animate-pulse">
              {currentType}
            </p>
            {progress.total > 0 && (
              <div className="w-64 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Progress</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
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
