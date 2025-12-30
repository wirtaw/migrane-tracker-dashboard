import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { LocationsService } from '../../services/locations';
import { CreateLocationDto, ISummaryResponse } from '../../models/locations.types';
import Loader from '../Loader';

interface ILocationManageFormProps {
  onSubmit?: () => void;
}

export default function LocationManageForm({ onSubmit }: ILocationManageFormProps) {
  const { apiSession, profileSettingsData } = useAuth();
  const { incidentList } = useProfileDataContext();

  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');

  const [summary, setSummary] = useState<ISummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Pre-fill location from user profile if available
  useEffect(() => {
    if (profileSettingsData?.latitude) setLatitude(profileSettingsData.latitude);
    if (profileSettingsData?.longitude) setLongitude(profileSettingsData.longitude);
  }, [profileSettingsData]);

  // Update date if incident is selected
  useEffect(() => {
    if (selectedIncidentId) {
      const incident = incidentList.find(i => i.id.toString() === selectedIncidentId);
      if (incident) {
        setDate(new Date(incident.datetimeAt).toISOString().split('T')[0]);
      }
    }
  }, [selectedIncidentId, incidentList]);

  const handleFetchSummary = async () => {
    if (!apiSession?.accessToken) return;
    setIsLoading(true);
    setError('');
    setSuccess('');
    setSummary(null);

    try {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid latitude or longitude');
      }

      const data = await LocationsService.getSummary(
        apiSession.accessToken,
        lat,
        lon,
        date,
        selectedIncidentId || undefined
      );
      setSummary(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch summary';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!apiSession?.accessToken || !summary) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const locationData: CreateLocationDto = {
        latitude: summary.latitude,
        longitude: summary.longitude,
        datetimeAt: summary.datetimeAt,
        incidentId: summary.incidentId,
        forecast: summary.forecast.map(f => ({
          datetime: f.datetime,
          description: f.description,
          temperature: f.temperature,
          pressure: f.pressure,
          humidity: f.humidity,
          windSpeed: f.windSpeed,
          clouds: f.clouds,
          uvi: f.uvi,
          directRadiation: f.directRadiation,
        })),
        solar: summary.solar.map(s => ({
          datetime: s.datetime,
          kIndex: s.kIndex,
          aIndex: s.aIndex,
          flareProbability: s.flareProbability ?? undefined,
        })),
        solarRadiation: summary.solarRadiation.map(r => ({
          date: r.date,
          ozone: r.ozone,
          solarFlux: r.solarFlux,
          sunsPotNumber: r.sunsPotNumber,
          uviIndex: r.uviIndex,
        })),
      };

      await LocationsService.createLocation(apiSession.accessToken, locationData);
      setSuccess('Location saved successfully');
      setSummary(null); // Clear summary after save

      // Ideally refresh location list here
      // const updatedLocations = await LocationsService.getLocations(token);
      // setLocationList(updatedLocations);

      if (onSubmit) onSubmit();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save location';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Incident (Optional)
          </label>
          <select
            value={selectedIncidentId}
            onChange={e => setSelectedIncidentId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Incident</option>
            {incidentList.map(incident => (
              <option key={incident.id} value={incident.id}>
                {new Date(incident.datetimeAt).toLocaleDateString()} - {incident.type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleFetchSummary}
          disabled={isLoading || !latitude || !longitude || !date}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Fetch Summary'}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {summary && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Summary Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <strong>Forecast Points:</strong> {summary.forecast.length}
            </div>
            <div>
              <strong>Solar Points:</strong> {summary.solar.length}
            </div>
            <div>
              <strong>Radiation Points:</strong> {summary.solarRadiation.length}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveLocation}
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
}
