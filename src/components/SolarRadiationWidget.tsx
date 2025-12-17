import React from 'react';
import { Zap, Waves, Clock, AlertCircle, RefreshCcw } from 'lucide-react';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

import { IRadiationTodayData } from '../services/weather';

function IndexBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const percentage = (value / max) * 100;

  return (
    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${colorClass} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface ISolarRadiationWidgetProps {
  data?: IRadiationTodayData[];
}

export default function SolarRadiationWidget({ data }: ISolarRadiationWidgetProps) {
  const {
    solarRadiationData: solarweather,
    loading: authLoading,
    solarRadiationError: error,
    fetchSolarRadiation,
    profileSettingsData,
  } = useAuth();

  const isLoading = data ? false : authLoading;

  if (isLoading) {
    return <Loader />;
  }

  const currentSolarRadiationData = data ? data : error || !solarweather ? [] : [...solarweather];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold dark:text-white">Solar Radiation</h2>
        </div>
        {!data && error && (
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Using default data</span>
          </div>
        )}
        {!data && (
          <div className="flex items-center gap-1 text-amber-500 text-sm hover:text-blue-900 dark:hover:text-white">
            <p>
              Reload{' '}
              <RefreshCcw
                className="w-3 h-3 hover"
                onClick={() => fetchSolarRadiation(profileSettingsData)}
              />
            </p>
          </div>
        )}
      </div>

      {currentSolarRadiationData?.length && (
        <>
          <div className="grid gap-6">
            {/* Space Weather Status */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tomorrow {currentSolarRadiationData[0].date}
                  </span>
                </div>
              </div>
            </div>

            {/* UV-Index */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">UV Index</span>
                </div>
                <span className="text-sm font-medium dark:text-gray-300">
                  {currentSolarRadiationData[0].UVIndex}
                </span>
              </div>
              <IndexBar
                value={currentSolarRadiationData[0].UVIndex}
                max={10}
                colorClass="bg-blue-500"
              />
            </div>

            {/* Ozone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ozone</span>
                </div>
                <span className="text-sm font-medium dark:text-gray-300">
                  {currentSolarRadiationData[0].ozone}
                </span>
              </div>
              <IndexBar
                value={currentSolarRadiationData[0].ozone}
                max={600}
                colorClass="bg-blue-500"
              />
            </div>
            {/* Kp Index */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Kp Index</span>
                </div>
                <span className="text-sm font-medium dark:text-gray-300">
                  {currentSolarRadiationData[0].kpIndex ?? 'N/A'}
                </span>
              </div>
              <IndexBar
                value={currentSolarRadiationData[0].kpIndex ?? 0}
                max={9}
                colorClass="bg-purple-500"
              />
            </div>
            {/* Solar Flux & Sunspots */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Solar Flux</span>
                </div>
                <div className="text-lg font-semibold dark:text-white">
                  {currentSolarRadiationData[0].solarFlux === 0
                    ? 'N/A'
                    : currentSolarRadiationData[0].solarFlux}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Sunspots</span>
                </div>
                <div className="text-lg font-semibold dark:text-white">
                  {currentSolarRadiationData[0].sunsPotNumber === 0
                    ? 'N/A'
                    : currentSolarRadiationData[0].sunsPotNumber}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
