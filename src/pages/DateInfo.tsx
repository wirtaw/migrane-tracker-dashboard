import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useParams, useLocation } from 'react-router-dom';
import {
  Info,
  UmbrellaIcon,
  MapPin,
  Clock,
  Activity,
  Droplets,
  Moon,
  Edit3,
  TrendingDown,
  Pill,
} from 'lucide-react';
import Modal from '../components/Modal';
import LocationManageForm from '../components/forms/LocationManageForm';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { useAuth } from '../context/AuthContext';
import { LocationsService } from '../services/locations';
import { getIsoDate } from '../lib/utils';
import {
  ITrigger,
  IIncident,
  IMedication,
  ISymptom,
  ILocationData,
} from '../models/profileData.types';
import IncidentCard from '../components/cards/IncidentCard';
import ForecastCard from '../components/cards/ForecastCard';
import TriggerCard from '../components/cards/TriggerCard';
import MedicationCard from '../components/cards/MedicationCard';
import SymptomCard from '../components/cards/SymptomsCard';
import SolarCard from '../components/cards/SolarCard';
import UVIndexIndicator from '../components/indicators/UVIndexIndicator';
import SunspotNumberIndicator from '../components/indicators/SunspotNumberIndicator';
import SolarFluxIndicator from '../components/indicators/SolarFluxIndicator';
import OzoneIndicator from '../components/indicators/OzoneIndicator';

export default function DateInfo() {
  const { date } = useParams();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());
  const {
    incidentList,
    medicationList,
    triggerList,
    symptomList,
    locationList,
    sleepList,
    waterList,
    bloodPressureList,
  } = useProfileDataContext();
  const { apiSession } = useAuth();
  const [triggerItems, setTriggerItems] = useState<ITrigger[]>([]);
  const [incidentItems, setIncidentItems] = useState<IIncident[]>([]);
  const [medicationItems, setMedicationItems] = useState<IMedication[]>([]);
  const [symptomItems, setSymptomItems] = useState<ISymptom[]>([]);
  const [locationItems, setLocationItems] = useState<ILocationData[]>([]);
  const [yesterdayLocations, setYesterdayLocations] = useState<ILocationData[]>([]);
  const [tomorrowLocations, setTomorrowLocations] = useState<ILocationData[]>([]);
  const [missingLocationIncidents, setMissingLocationIncidents] = useState<IIncident[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedIncidentForLocation, setSelectedIncidentForLocation] = useState<string>('');
  const [exists, setExists] = useState(false);
  const [locationAliases] = useState<Record<string, string>>({});

  // Generate 3-day horizon data
  const threeDayHorizon = {
    yesterday: selectedDate.minus({ days: 1 }),
    today: selectedDate,
    tomorrow: selectedDate.plus({ days: 1 }),
  };

  // Get threat level based on K-index or pressure
  const getThreatLevel = (location: ILocationData) => {
    const kIndex = location.solar?.[0]?.kIndex || 0;
    const pressure = location.forecast?.[0]?.pressure || 1013;

    if (kIndex >= 6 || pressure < 1000) return 'high';
    if (kIndex >= 4 || pressure < 1005) return 'medium';
    return 'low';
  };

  // Format coordinates for display with alias support
  const formatLocation = (location: ILocationData) => {
    const key = `${location.latitude},${location.longitude}`;
    const alias = locationAliases[key];
    return alias || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
  };

  // Compare weather data between two locations with 3-hourly granularity
  const compareWeather = (
    current: ILocationData,
    target: ILocationData | undefined,
    currentDate: DateTime,
    targetDate: DateTime
  ) => {
    const actualTarget = target || current;
    const isSameLocation =
      current.latitude === actualTarget.latitude && current.longitude === actualTarget.longitude;
    const diffs: {
      label: string;
      value: string;
      delta: string;
      trend: 'up' | 'down' | 'neutral';
      isSameLocation: boolean;
      time?: string;
    }[] = [];

    const hours = [0, 3, 6, 9, 12, 15, 18, 21];

    hours.forEach(hour => {
      const currentForecast = current.forecast?.find(f => {
        const dt = DateTime.fromISO(f.datetime);
        return dt.hour === hour && dt.toISODate() === currentDate.toISODate();
      });
      const targetForecast = actualTarget.forecast?.find(f => {
        const dt = DateTime.fromISO(f.datetime);
        return dt.hour === hour && dt.toISODate() === targetDate.toISODate();
      });
      const currentSolar = current.solar?.find(s => {
        const dt = DateTime.fromISO(s.datetime);
        return dt.hour === hour && dt.toISODate() === currentDate.toISODate();
      });
      const targetSolar = actualTarget.solar?.find(s => {
        const dt = DateTime.fromISO(s.datetime);
        return dt.hour === hour && dt.toISODate() === targetDate.toISODate();
      });

      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

      if (currentForecast && targetForecast) {
        // Pressure comparison
        const pDiff = (targetForecast.pressure || 0) - (currentForecast.pressure || 0);
        if (Math.abs(pDiff) >= 2) {
          diffs.push({
            label: 'Pressure',
            value: `${targetForecast.pressure?.toFixed(2)} hPa`,
            delta: `${pDiff > 0 ? '+' : ''}${pDiff.toFixed(2)}`,
            trend: pDiff > 0 ? 'up' : 'down',
            isSameLocation,
            time: timeLabel,
          });
        }

        // Temperature comparison
        const tDiff = (targetForecast.temperature || 0) - (currentForecast.temperature || 0);
        if (Math.abs(tDiff) >= 3) {
          diffs.push({
            label: 'Temp',
            value: `${targetForecast.temperature?.toFixed(1)}°C`,
            delta: `${tDiff > 0 ? '+' : ''}${tDiff.toFixed(1)}°C`,
            trend: tDiff > 0 ? 'up' : 'down',
            isSameLocation,
            time: timeLabel,
          });
        }
      }

      if (currentSolar && targetSolar) {
        // K-Index comparison
        const kDiff = (targetSolar.kIndex || 0) - (currentSolar.kIndex || 0);
        if (Math.abs(kDiff) >= 1) {
          diffs.push({
            label: 'Solar (K)',
            value: `K-Index ${targetSolar.kIndex}`,
            delta: `${kDiff > 0 ? '+' : ''}${kDiff}`,
            trend: kDiff > 0 ? 'up' : 'down',
            isSameLocation,
            time: timeLabel,
          });
        }
      }
    });

    return diffs;
  };

  // Get sleep data for selected date
  const selectedSleep = sleepList.find(
    s => getIsoDate(new Date(s.datetimeAt)) === selectedDate.toISODate()
  );

  const formatSleepDuration = (sleep: typeof selectedSleep) => {
    if (!sleep) return 'No data';
    if (sleep.minutesTotal) {
      const hours = Math.floor(sleep.minutesTotal / 60);
      const minutes = sleep.minutesTotal % 60;
      return `${hours}h ${minutes}m`;
    }
    if (sleep.startedAt) {
      const start = DateTime.fromJSDate(new Date(sleep.startedAt));
      const end = DateTime.fromJSDate(new Date(sleep.datetimeAt));
      const duration = end.diff(start, ['hours', 'minutes']);
      return `${Math.floor(duration.hours)}h ${Math.floor(duration.minutes)}m`;
    }
    return 'No data';
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dateValue = queryParams.get('date');
    const date = dateValue ? DateTime.fromISO(dateValue) : DateTime.now();
    setSelectedDate(date.isValid ? date : DateTime.now());
    setSelectedDate(date.isValid ? date : DateTime.now());

    let exists = 0;

    if (incidentList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setIncidentItems(
        incidentList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate())
      );
      exists++;
    }
    if (medicationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setMedicationItems(
        medicationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate())
      );
      exists++;
    }
    if (triggerList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setTriggerItems(triggerList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
      exists++;
    }
    if (symptomList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setSymptomItems(symptomList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
      exists++;
    }
    // TODO get in date raknge location data
    // Locations filtering: matches date OR matches an incident on this date
    const dateIncidents = incidentList.filter(
      item => getIsoDate(item.datetimeAt) === date.toISODate()
    );
    const incidentIds = dateIncidents.map(i => i.id.toString());

    const fetchAllLocations = async () => {
      if (!apiSession?.accessToken) return;

      const startDate = date.minus({ days: 1 }).toISODate();
      const endDate = date.plus({ days: 1 }).toISODate();

      try {
        // 1. Fetch range for [Yesterday, Tomorrow]
        const rangeLocations = await LocationsService.getLocationsByRange(
          apiSession.accessToken,
          startDate!,
          endDate!
        );

        const yLocations = rangeLocations.filter(item => getIsoDate(item.datetimeAt) === startDate);
        const tLocations = rangeLocations.filter(item => getIsoDate(item.datetimeAt) === endDate);
        const todayLocations = rangeLocations.filter(
          item => getIsoDate(item.datetimeAt) === date.toISODate()
        );

        setYesterdayLocations(yLocations);
        setTomorrowLocations(tLocations);

        // 2. Fetch missing incident-based locations for today
        const fetchedIncidentLocations: ILocationData[] = [];
        const missingIds: string[] = [];

        for (const incidentId of incidentIds) {
          // Check if we already have this incident's location in current list
          const existing = todayLocations.find(l => l.incidentId === incidentId);
          if (existing) {
            fetchedIncidentLocations.push(existing);
          } else {
            try {
              const location = await LocationsService.getLocationByIncidentId(
                apiSession.accessToken,
                incidentId
              );
              if (location) {
                fetchedIncidentLocations.push(location);
              } else {
                missingIds.push(incidentId);
              }
            } catch (error) {
              console.error(`Failed to fetch location for incident ${incidentId}`, error);
            }
          }
        }

        setMissingLocationIncidents(
          dateIncidents.filter(incident => missingIds.includes(incident.id.toString()))
        );

        // Merge today's range locations with fetched incident locations
        const allTodayLocations = [...todayLocations, ...fetchedIncidentLocations];
        const uniqueTodayLocations = Array.from(
          new Map(allTodayLocations.map(item => [item.id, item])).values()
        );

        if (uniqueTodayLocations.length || missingIds.length) {
          setLocationItems(uniqueTodayLocations);
          setExists(true);
        } else {
          if (exists > 0) setExists(true);
        }
      } catch (err) {
        console.error('Failed to fetch range locations', err);
      }
    };

    fetchAllLocations();

    setExists(exists !== 0);
  }, [
    date,
    location.search,
    incidentList,
    locationList,
    medicationList,
    symptomList,
    triggerList,
    apiSession,
  ]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Investigative Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedDate.toFormat('MMMM dd, yyyy')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">The 3-Day Horizon Analysis</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
                <p className="font-semibold">{threeDayHorizon.yesterday.day}</p>
              </div>
              <div className="text-center bg-blue-100 dark:bg-blue-900 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-600 dark:text-blue-400">Today</p>
                <p className="font-bold text-blue-800 dark:text-blue-200">
                  {threeDayHorizon.today.day}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tomorrow</p>
                <p className="font-semibold">{threeDayHorizon.tomorrow.day}</p>
              </div>
            </div>
          </div>

          {/* Location Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Where were you?
                </h2>
              </div>
              <button
                onClick={() => setActiveModal('location')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Location
              </button>
            </div>

            {locationItems.length > 0 ? (
              <div className="space-y-3">
                {locationItems.map(location => {
                  const threatLevel = getThreatLevel(location);
                  return (
                    <div
                      key={location.id}
                      className={`p-4 rounded-lg border-2 ${
                        threatLevel === 'high'
                          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                          : threatLevel === 'medium'
                            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatLocation(location)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getIsoDate(location.datetimeAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Threat Level</p>
                          <p
                            className={`font-semibold ${
                              threatLevel === 'high'
                                ? 'text-red-600 dark:text-red-400'
                                : threatLevel === 'medium'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-green-600 dark:text-green-400'
                            }`}
                          >
                            {threatLevel.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No location data for this day
              </div>
            )}

            {missingLocationIncidents.length > 0 && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-orange-800 dark:text-orange-200 font-medium mb-2">
                  Missing location data for {missingLocationIncidents.length} incident(s)
                </p>
                <button
                  onClick={() => setActiveModal('location')}
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline"
                >
                  Add locations now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Correlation Canvas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Correlation Canvas
            </h2>
          </div>

          {/* Timeline Header */}
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>Yesterday 12:00</span>
              <span>Today 00:00</span>
              <span>Today 12:00</span>
              <span>Tomorrow 00:00</span>
              <span>Tomorrow 12:00</span>
            </div>

            {/* Threat Level Background */}
            <div className="relative h-32 rounded-lg mb-4 overflow-hidden bg-gray-100 dark:bg-gray-700">
              {locationItems.map(location => {
                const threatLevel = getThreatLevel(location);
                return (
                  <div
                    key={location.id}
                    className={`absolute inset-0 ${
                      threatLevel === 'high'
                        ? 'bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800/30 dark:to-red-900/30'
                        : threatLevel === 'medium'
                          ? 'bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800/30 dark:to-yellow-900/30'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/20 dark:to-gray-600/20'
                    }`}
                  />
                );
              })}

              {/* Incidents Layer */}
              {incidentItems.map(incident => {
                const startHour = DateTime.fromJSDate(incident.startTime).hour;
                const leftPosition = ((startHour + 12) / 36) * 100; // 36-hour span
                const width = (incident.durationHours / 36) * 100;

                return (
                  <div
                    key={incident.id}
                    className="absolute bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      left: `${leftPosition}%`,
                      width: `${Math.max(width, 8)}%`,
                      top: '20%',
                    }}
                    title={`${incident.type} - ${incident.durationHours}h`}
                  >
                    {incident.type}
                  </div>
                );
              })}

              {/* Medication Markers */}
              {medicationItems.map(medication => {
                const hour = DateTime.fromJSDate(medication.datetimeAt).hour;
                const leftPosition = ((hour + 12) / 36) * 100;

                return (
                  <div
                    key={medication.id}
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${leftPosition}%` }}
                  >
                    <div title={medication.title}>
                      <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                );
              })}

              {/* Timeline Labels */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {incidentItems.length === 0 && medicationItems.length === 0
                    ? 'No incidents or medications recorded'
                    : 'Timeline view'}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-900 dark:bg-gray-100 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Migraine Incident</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-600 dark:text-gray-400">Medication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800/30 dark:to-red-900/30 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">High Threat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Locker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Health Log Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Vital Signs
              </h3>
            </div>

            <div className="space-y-3">
              {/* Sleep Card */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sleep</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatSleepDuration(selectedSleep)}
                    </p>
                    {selectedSleep && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedSleep.minutesDeep !== undefined && (
                          <span>Deep: {selectedSleep.minutesDeep}m </span>
                        )}
                        {selectedSleep.minutesRem !== undefined && (
                          <span>Rem: {selectedSleep.minutesRem}m</span>
                        )}
                      </div>
                    )}
                    {selectedSleep &&
                      selectedSleep.rate !== undefined &&
                      selectedSleep.rate < 3 && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Below optimal
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Hydration Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hydration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {waterList
                        .filter(
                          w => getIsoDate(new Date(w.datetimeAt)) === selectedDate.toISODate()
                        )
                        .reduce((acc, curr) => acc + curr.ml, 0)}{' '}
                      ml
                    </p>
                  </div>
                </div>
              </div>

              {/* Blood Pressure Card */}
              {bloodPressureList.find(
                bp => getIsoDate(new Date(bp.datetimeAt)) === selectedDate.toISODate()
              ) && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</p>
                      {bloodPressureList
                        .filter(
                          bp => getIsoDate(new Date(bp.datetimeAt)) === selectedDate.toISODate()
                        )
                        .map((bp, i) => (
                          <p key={i} className="font-semibold text-gray-900 dark:text-white">
                            {bp.systolic}/{bp.diastolic}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Yesterday Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Yesterday</h3>
            </div>

            <div className="space-y-3">
              {locationItems[0] ? (
                (() => {
                  const dayDiffs = compareWeather(
                    locationItems[0],
                    yesterdayLocations[0],
                    selectedDate,
                    selectedDate.minus({ days: 1 })
                  );
                  return dayDiffs.length > 0 ? (
                    dayDiffs.map((diff, i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {diff.time}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{diff.label}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              diff.isSameLocation
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                            }`}
                          >
                            {diff.isSameLocation ? 'Change' : 'Comparison'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{diff.value}</p>
                          <span
                            className={`text-xs font-bold ${
                              diff.trend === 'up' ? 'text-red-500' : 'text-blue-500'
                            }`}
                          >
                            ({diff.delta})
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {diff.trend === 'up' ? 'Increase' : 'Decrease'} detected
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No significant changes detected</p>
                  );
                })()
              ) : (
                <p className="text-sm text-gray-500 italic">No comparison data available</p>
              )}
              {yesterdayLocations.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  Note: Using current location's historical data
                </p>
              )}
            </div>
          </div>

          {/* Tomorrow Forecast */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tomorrow</h3>
            </div>

            <div className="space-y-3">
              {locationItems[0] ? (
                (() => {
                  const dayDiffs = compareWeather(
                    locationItems[0],
                    tomorrowLocations[0],
                    selectedDate,
                    selectedDate.plus({ days: 1 })
                  );
                  return dayDiffs.length > 0 ? (
                    dayDiffs.map((diff, i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                              {diff.time}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{diff.label}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              diff.isSameLocation
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            }`}
                          >
                            {diff.isSameLocation ? 'Forecast Change' : 'Spatial Forecast'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{diff.value}</p>
                          <span
                            className={`text-xs font-bold ${
                              diff.trend === 'up' ? 'text-orange-500' : 'text-blue-500'
                            }`}
                          >
                            ({diff.delta})
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {diff.trend === 'up' ? 'Rise' : 'Drop'} expected
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No significant changes forecast</p>
                  );
                })()
              ) : (
                <p className="text-sm text-gray-500 italic">No forecast data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Traditional Cards Section (Collapsible) */}
        {exists && (
          <details className="mb-6">
            <summary className="cursor-pointer text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 hover:text-gray-900 dark:hover:text-white">
              Show Detailed Logs ▼
            </summary>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-8">
                {locationItems.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          Detailed Location & Environmental Data
                        </h2>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {locationItems.map(location => (
                          <div key={'location-' + location.id}>
                            <span>
                              Coordinates - {location.latitude} / {location.longitude}
                            </span>
                            <br />
                            {location.forecast && (
                              <ForecastCard
                                key={'location-' + location.id + '-forecast-card'}
                                forecast={location.forecast}
                              />
                            )}
                            <br />
                            {location.solar && (
                              <SolarCard
                                key={'location-' + location.id + '-solar-card'}
                                solar={location.solar}
                              />
                            )}
                            <br />
                            {location.solarRadiation.map(solarRadiation => (
                              <div key={'solarRadiation-' + solarRadiation?.date}>
                                <div className="grid grid-cols-1 gap-4 pb-2">
                                  <div className="flex items-center gap-2 p-4 bg-gradient-to-br dark:from-[#d1d5db]-900/20 dark:to-[#374151]-900/20 from-[#d1d5db] via-[#6b7280] to-[#374151] rounded-lg text-gray-100 dark:text-gray-800">
                                    <div>{solarRadiation?.date}</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pb-2">
                                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
                                    <UmbrellaIcon className="w-5 h-5 text-amber-500" />
                                    <div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        UV Index
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold dark:text-white">
                                          {solarRadiation?.uviIndex}
                                        </span>
                                        <UVIndexIndicator
                                          uvi={solarRadiation?.uviIndex || 0}
                                          showDetails={true}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                                    <div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Ozone
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold dark:text-white">
                                          {solarRadiation?.ozone}
                                        </span>
                                        <OzoneIndicator ozone={solarRadiation?.ozone || 0} />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pb-2">
                                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                                    <div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Solar Flux
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold dark:text-white">
                                          {solarRadiation?.solarFlux}
                                        </span>
                                        <SolarFluxIndicator
                                          solarFlux={solarRadiation?.solarFlux || 0}
                                          showDetails={true}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg">
                                    <div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Sunspot Number
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold dark:text-white">
                                          {solarRadiation?.sunsPotNumber}
                                        </span>
                                        <SunspotNumberIndicator
                                          sunspotNumber={solarRadiation?.sunsPotNumber || 0}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </div>

              {/* Sidebar Column (1/3) - Lists */}
              <div className="space-y-6">
                {incidentItems.length > 0 && (
                  <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          Incidents
                        </h2>
                      </div>
                      {incidentItems.map(incident => (
                        <IncidentCard
                          key={'incident-' + selectedDate.toMillis() + '-card-' + incident.id}
                          incident={incident}
                        />
                      ))}
                    </section>
                  </div>
                )}

                {triggerItems.length > 0 && (
                  <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          Triggers
                        </h2>
                      </div>
                      {triggerItems.map(trigger => (
                        <TriggerCard
                          key={'trigger-' + selectedDate.toMillis() + '-card-' + trigger.id}
                          trigger={trigger}
                        />
                      ))}
                    </section>
                  </div>
                )}

                {medicationItems.length > 0 && (
                  <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          Medications
                        </h2>
                      </div>
                      {medicationItems.map(medication => (
                        <MedicationCard
                          key={'medication-' + selectedDate.toMillis() + '-card-' + medication.id}
                          medication={medication}
                        />
                      ))}
                    </section>
                  </div>
                )}

                {symptomItems.length > 0 && (
                  <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          Symptoms
                        </h2>
                      </div>
                      {symptomItems.map(symptom => (
                        <SymptomCard
                          key={'symptom-' + selectedDate.toMillis() + '-card-' + symptom.id}
                          symptom={symptom}
                        />
                      ))}
                    </section>
                  </div>
                )}
              </div>
            </div>
          </details>
        )}

        {!exists && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  No items recorded for this day
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
      <Modal
        isOpen={activeModal === 'location'}
        onClose={() => {
          setActiveModal(null);
          setSelectedIncidentForLocation('');
        }}
        title="Add Location"
      >
        <LocationManageForm
          incidents={incidentList.filter(
            i => getIsoDate(i.datetimeAt) === selectedDate.toISODate()
          )}
          initialIncidentId={selectedIncidentForLocation}
          onSubmit={() => {
            setActiveModal(null);
            window.location.reload();
          }}
        />
      </Modal>
    </>
  );
}
