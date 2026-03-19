import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createIncident, CreateIncidentDto } from '../../services/incidents';
import { createTrigger } from '../../services/triggers';
import { createMedication } from '../../services/medications';
import { createSymptom } from '../../services/symptoms';
import { LocationsService } from '../../services/locations';
import { IForecastDto, ISolarDto, ISolarRadiationDto } from '../../models/locations.types';
import Loader from '../Loader';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { validateImportData, IMaxIds } from '../../utils/dataValidation';
import {
  createWeight,
  createBloodPressure,
  createHeight,
  createSleep,
  createWater,
} from '../../services/health-logs';

interface IDatabaseUploadFormProps {
  onSubmit: () => void;
}

interface IProgress {
  type: string;
  current: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  failed: number;
  errors: string[];
}

interface RawIncident {
  id?: number | string;
  type: string;
  startTime: string;
  durationHours: number;
  notes?: string;
  triggers?: string[];
  datetimeAt: string;
}

interface RawTrigger {
  type: string;
  note?: string;
  datetimeAt: string;
}

interface RawMedication {
  title: string;
  dosage: string;
  notes?: string;
  datetimeAt: string;
}

interface RawSymptom {
  type: string;
  severity: number;
  notes?: string;
  note?: string;
  datetimeAt: string;
}

interface RawLocation {
  latitude: number;
  longitude: number;
  datetimeAt: string;
  incidentId?: number | string;
  forecast?: IForecastDto[];
  solar?: ISolarDto[];
  solarRadiation?: ISolarRadiationDto[];
}

interface RawHealthLogWeight {
  weight: number;
  datetimeAt: string;
  notes?: string;
}

interface RawHealthLogHeight {
  height: number;
  datetimeAt: string;
  notes?: string;
}

interface RawHealthLogBloodPressure {
  systolic: number;
  diastolic: number;
  datetimeAt: string;
  notes?: string;
}

interface RawHealthLogSleep {
  minutesTotal: number;
  minutesDeep: number;
  minutesRem: number;
  rate: number;
  timesWakeUp: number;
  datetimeAt: Date;
  notes?: string;
  startedAt: Date;
}

interface RawHealthLogWater {
  ml: number;
  datetimeAt: string;
  notes?: string;
}

export default function DatabaseUploadForm({ onSubmit }: IDatabaseUploadFormProps) {
  const { apiSession } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<IProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { incidentTypeEnumList, setBrokenImportData } = useProfileDataContext();

  const mapToIncidentType = (type: string): string => {
    if (incidentTypeEnumList.includes(type)) {
      return type as string;
    }
    if (type.toLowerCase().includes('migraine')) return 'Migraine Attack';
    if (type.toLowerCase().includes('tension')) return 'Tension Headache';
    return 'Other';
  };

  const sanitizeLocationData = (location: RawLocation): RawLocation => {
    const sanitizeArray = <T,>(arr: T[] | undefined): T[] | undefined => {
      if (!arr) return undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      return arr.map(({ _id, ...rest }: any) => rest);
    };

    return {
      ...location,
      forecast: sanitizeArray(location.forecast),
      solar: sanitizeArray(location.solar),
      solarRadiation: sanitizeArray(location.solarRadiation),
    };
  };

  const uploadConcurrent = async <T, R>(
    items: T[],
    uploadFn: (item: T) => Promise<R>,
    onItemSuccess: (result: R, originalItem: T) => void,
    onProgressUpdate: (current: number, failed: number, errors: string[]) => void
  ) => {
    let completedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    const CHUNK_SIZE = 5; // Process 5 items at a time to avoid overwhelming the server
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      const chunk = items.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(async item => {
          try {
            const result = await uploadFn(item);
            onItemSuccess(result, item);
          } catch (err) {
            failedCount++;
            const msg = err instanceof Error ? err.message : String(err);
            errors.push(`Failed item: ${JSON.stringify(item).slice(0, 50)}... Error: ${msg}`);
            console.error('Upload failed for item:', item, err);
          } finally {
            completedCount++;
            onProgressUpdate(completedCount, failedCount, errors);
            setOverallProgress(prev => ({ ...prev, current: prev.current + 1 }));
          }
        })
      );
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiSession?.accessToken) {
      setErrorMessage(!file ? 'No file selected' : 'Session expired. Please log in again.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async event => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      try {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        const data = JSON.parse(content);
        const token = apiSession.accessToken;
        const userId = apiSession.userId;

        const maxIds: IMaxIds = {
          incidents: 0,
          triggers: 0,
          medications: 0,
          symptoms: 0,
          weights: 0,
          heights: 0,
          bloodPressures: 0,
          sleeps: 0,
          waters: 0,
        };
        const { validData, brokenData } = validateImportData(data, maxIds);

        setBrokenImportData({
          incidents: brokenData.incidents.length > 0 ? brokenData.incidents : null,
          triggers: brokenData.triggers.length > 0 ? brokenData.triggers : null,
          symptoms: brokenData.symptoms.length > 0 ? brokenData.symptoms : null,
          medications: brokenData.medications.length > 0 ? brokenData.medications : null,
          locations: brokenData.locations.length > 0 ? brokenData.locations : null,
          healthLogs: {
            weights:
              brokenData.healthLogs.weights.length > 0 ? brokenData.healthLogs.weights : null,
            heights:
              brokenData.healthLogs.heights.length > 0 ? brokenData.healthLogs.heights : null,
            bloodPressures:
              brokenData.healthLogs.bloodPressures.length > 0
                ? brokenData.healthLogs.bloodPressures
                : null,
            sleeps: brokenData.healthLogs.sleeps.length > 0 ? brokenData.healthLogs.sleeps : null,
            waters: brokenData.healthLogs.waters.length > 0 ? brokenData.healthLogs.waters : null,
          },
        });

        const incidents = validData.incidents;
        const triggers = validData.triggers;
        const medications = validData.medications;
        const symptoms = validData.symptoms;
        const locations = validData.locations;
        const weights = validData.healthLogs.weights;
        const heights = validData.healthLogs.heights;
        const bloodPressures = validData.healthLogs.bloodPressures;
        const sleeps = validData.healthLogs.sleeps;
        const waters = validData.healthLogs.waters;

        const totalItems =
          incidents.length +
          triggers.length +
          medications.length +
          symptoms.length +
          locations.length +
          weights.length +
          heights.length +
          bloodPressures.length +
          sleeps.length +
          waters.length;
        setOverallProgress({ current: 0, total: totalItems });

        const initialProgress: IProgress[] = [
          {
            type: 'Incidents',
            current: 0,
            total: incidents.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Triggers',
            current: 0,
            total: triggers.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Medications',
            current: 0,
            total: medications.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Symptoms',
            current: 0,
            total: symptoms.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Locations',
            current: 0,
            total: locations.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Weights',
            current: 0,
            total: weights.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Heights',
            current: 0,
            total: heights.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Blood Pressures',
            current: 0,
            total: bloodPressures.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Sleeps',
            current: 0,
            total: sleeps.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
          {
            type: 'Waters',
            current: 0,
            total: waters.length,
            status: 'pending',
            failed: 0,
            errors: [],
          },
        ];
        setProgress(initialProgress);

        const incidentIdMap: Record<string, string> = {};

        // 1. Upload Incidents (Sequential generally safer for ID mapping)
        if (incidents.length > 0) {
          setProgress(prev =>
            prev.map((p, idx) => (idx === 0 ? { ...p, status: 'processing' } : p))
          );
          await uploadConcurrent(
            incidents,
            (item: RawIncident) => {
              const dto: CreateIncidentDto = {
                userId: userId,
                type: mapToIncidentType(item.type),
                startTime: item.startTime,
                durationHours: item.durationHours,
                notes: item.notes,
                triggers: item.triggers,
                datetimeAt: item.datetimeAt,
              };
              return createIncident(dto, token);
            },
            (created, original: RawIncident) => {
              if (original.id) {
                incidentIdMap[original.id.toString()] = created.id;
              }
            },
            (current, failed, errors) =>
              setProgress(prev =>
                prev.map((p, idx) => (idx === 0 ? { ...p, current, failed, errors } : p))
              )
          );
          setProgress(prev =>
            prev.map((p, idx) => (idx === 0 ? { ...p, status: 'completed' } : p))
          );
        }

        // Run independent types in parallel
        await Promise.all([
          // 2. Upload Triggers
          triggers.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 1 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  triggers,
                  (item: RawTrigger) =>
                    createTrigger(
                      {
                        userId: userId,
                        type: item.type,
                        note: item.note,
                        datetimeAt: item.datetimeAt,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 1 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 1 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),

          // 3. Upload Medications
          medications.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 2 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  medications,
                  (item: RawMedication) =>
                    createMedication(
                      {
                        userId: userId,
                        title: item.title,
                        dosage: item.dosage,
                        notes: item.notes,
                        datetimeAt: item.datetimeAt,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 2 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 2 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),

          // 4. Upload Symptoms
          symptoms.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 3 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  symptoms,
                  (item: RawSymptom) =>
                    createSymptom(
                      {
                        userId: userId,
                        type: item.type,
                        severity: item.severity,
                        note: item.notes || item.note,
                        datetimeAt: item.datetimeAt,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 3 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 3 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),
        ]);

        // 5. Upload Locations (Concurrent, but needs incident mapping)
        if (locations.length > 0) {
          setProgress(prev =>
            prev.map((p, idx) => (idx === 4 ? { ...p, status: 'processing' } : p))
          );
          await uploadConcurrent(
            locations,
            (item: RawLocation) => {
              const sanitizedItem = sanitizeLocationData(item);
              return LocationsService.createLocation(token, {
                userId: userId,
                latitude: sanitizedItem.latitude,
                longitude: sanitizedItem.longitude,
                datetimeAt: sanitizedItem.datetimeAt,
                incidentId: sanitizedItem.incidentId
                  ? incidentIdMap[sanitizedItem.incidentId.toString()] || undefined
                  : undefined,
                forecast: sanitizedItem.forecast,
                solar: sanitizedItem.solar,
                solarRadiation: sanitizedItem.solarRadiation,
              });
            },
            () => {},
            (current, failed, errors) =>
              setProgress(prev =>
                prev.map((p, idx) => (idx === 4 ? { ...p, current, failed, errors } : p))
              )
          );
          setProgress(prev =>
            prev.map((p, idx) => (idx === 4 ? { ...p, status: 'completed' } : p))
          );
        }

        // 6. Upload Health Logs (Weights, Heights, Blood Pressures, Sleeps, Waters)
        await Promise.all([
          weights.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 5 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  weights,
                  (item: RawHealthLogWeight) =>
                    createWeight(
                      {
                        userId: userId,
                        weight: item.weight,
                        notes: item.notes,
                        datetimeAt: item.datetimeAt,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 5 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 5 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),
          heights.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 6 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  heights,
                  (item: RawHealthLogHeight) =>
                    createHeight(
                      {
                        userId: userId,
                        height: item.height,
                        datetimeAt: item.datetimeAt,
                        notes: item.notes,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 6 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 6 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),
          bloodPressures.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 7 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  bloodPressures,
                  (item: RawHealthLogBloodPressure) =>
                    createBloodPressure(
                      {
                        userId: userId,
                        systolic: item.systolic,
                        diastolic: item.diastolic,
                        datetimeAt: item.datetimeAt,
                        notes: item.notes,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 7 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 7 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),
          sleeps.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 8 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  sleeps,
                  (item: RawHealthLogSleep) =>
                    createSleep(
                      {
                        userId: userId,
                        datetimeAt: new Date(item.datetimeAt).toISOString(),
                        notes: item.notes,
                        minutesDeep: item.minutesDeep,
                        minutesRem: item.minutesRem,
                        minutesTotal: item.minutesTotal,
                        timesWakeUp: item.timesWakeUp,
                        rate: item.rate,
                        startedAt: new Date(item.startedAt).toISOString(),
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 8 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 8 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),
          waters.length > 0
            ? (async () => {
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 9 ? { ...p, status: 'processing' } : p))
                );
                await uploadConcurrent(
                  waters,
                  (item: RawHealthLogWater) =>
                    createWater(
                      {
                        userId: userId,
                        ml: item.ml,
                        datetimeAt: item.datetimeAt,
                        notes: item.notes,
                      },
                      token
                    ),
                  () => {},
                  (current, failed, errors) =>
                    setProgress(prev =>
                      prev.map((p, idx) => (idx === 9 ? { ...p, current, failed, errors } : p))
                    )
                );
                setProgress(prev =>
                  prev.map((p, idx) => (idx === 9 ? { ...p, status: 'completed' } : p))
                );
              })()
            : Promise.resolve(),
        ]);

        const hasErrors = progress.some(p => p.failed > 0);
        if (hasErrors) {
          setSuccessMessage('Data upload completed with some errors. See details below.');
        } else {
          setSuccessMessage('Data successfully uploaded to database.');
        }
      } catch (err) {
        setErrorMessage(
          'Error processing JSON file: ' + (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Error reading file.');
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload JSON file to Database
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
            dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
        />
      </div>

      <div className="relative p-6 flex-auto">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Loader />
          </div>
        )}

        {(isLoading || progress.length > 0) && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl shadow-inner">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Overall Progress
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {Math.round((overallProgress.current / overallProgress.total) * 100) || 0}% (
                  {overallProgress.current}/{overallProgress.total})
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-sm">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${(overallProgress.current / overallProgress.total) * 100 || 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {progress.map(p => (
                <div
                  key={p.type}
                  className="space-y-1.5 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">{p.type}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        p.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : p.status === 'processing'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 animate-pulse'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          p.status === 'completed'
                            ? p.failed > 0
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : p.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-indigo-500'
                        }`}
                        style={{ width: `${p.total > 0 ? (p.current / p.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 min-w-[70px] text-right">
                      {p.current}/{p.total} {p.failed > 0 && `(${p.failed} fail)`}
                    </span>
                  </div>

                  {/* Individual Errors */}
                  {p.errors.length > 0 && (
                    <details className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <summary className="cursor-pointer hover:underline">
                        View {p.errors.length} errors
                      </summary>
                      <ul className="mt-1 space-y-1 list-disc list-inside max-h-32 overflow-y-auto">
                        {p.errors.map((err, i) => (
                          <li key={i} className="truncate" title={err}>
                            {err}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={onSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
