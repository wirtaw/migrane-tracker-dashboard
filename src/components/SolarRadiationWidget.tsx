import React from 'react';
import { Zap, Waves, Clock, AlertCircle, RefreshCcw } from 'lucide-react';
import { env } from '../config/env';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

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

export default function SolarRadiationWidget() {
  const {
    solarRadiationData: solarweather,
    loading,
    solarRadiationError: error,
    fetchSolarRadiation,
    profileSettingsData,
  } = useAuth();

  if (loading) {
    return <Loader />;
  }

  const currentSolarRadiationData = error || !solarweather ? [] : [...solarweather];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold dark:text-white">Solar Radiation</h2>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Using default data</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-amber-500 text-sm hover:text-blue-900 dark:hover:text-white">
          <p>
            Reload{' '}
            <RefreshCcw
              className="w-3 h-3 hover"
              onClick={() => fetchSolarRadiation(profileSettingsData)}
            />
          </p>
        </div>
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
          </div>

          <div className="flex justify-between pt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Source: </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <a
                href={env.TEMIS_BASE_RESOURCE_URL}
                target="_blank"
                className="text-blue-600 visited:text-purple-600 underline "
              >
                {env.TEMIS_BASE_RESOURCE_TITLE}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
