import React from 'react';
import { Zap, Waves, Activity, Clock, AlertTriangle, AlertCircle, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { env } from '../config/env';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

export interface IGeomagneticData {
  solarFlux: number;
  kIndex: number;
  aIndex: number;
  pastWeather: { level: string };
  nextWeather: { level: string };
}

function SpaceWeatherIndicator({ level }: { level: string }) {
  const getStatusColor = (level: string) => {
    switch (level) {
      case 'quiet':
        return 'bg-green-500';
      case 'minor':
        return 'bg-yellow-500';
      case 'moderate':
        return 'bg-orange-500';
      case 'strong':
        return 'bg-red-500';
      case 'severe':
        return 'bg-purple-500';
      case 'extreme':
        return 'bg-pink-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor(level)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getStatusText(level)}</span>
    </div>
  );
}

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

export default function GeoMagneticWidget() {
  const {
    geomagneticData: geophysicalweather,
    loading,
    geoMagneticError: error,
    fetchGeomagnetic,
  } = useAuth();

  const geomagneticData = {
    solarFlux: undefined,
    kIndex: undefined,
    aIndex: undefined,
    pastWeather: {
      level: undefined,
    },
    nextWeather: {
      level: undefined,
    },
  };

  if (loading) {
    return <Loader />;
  }

  const currentGeomagneticData =
    error || !geophysicalweather ? geomagneticData : { ...geomagneticData, ...geophysicalweather };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold dark:text-white">Geomagnetic Activity</h2>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Using default data</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-amber-500 text-sm hover:text-blue-900 dark:hover:text-white">
          <p>
            Reload <RefreshCcw className="w-3 h-3 hover" onClick={() => fetchGeomagnetic()} />
          </p>
        </div>
      </div>

      {currentGeomagneticData?.solarFlux &&
        currentGeomagneticData?.kIndex &&
        currentGeomagneticData?.aIndex && (
          <>
            <div className="grid gap-6">
              {/* Solar Flux */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Solar Flux (sfu)
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {currentGeomagneticData.solarFlux}
                  </span>
                </div>
                <IndexBar
                  value={currentGeomagneticData.solarFlux}
                  max={200}
                  colorClass="bg-yellow-400"
                />
              </div>

              {/* K-Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">K-Index</span>
                  </div>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {currentGeomagneticData.kIndex}/9
                  </span>
                </div>
                <IndexBar
                  value={currentGeomagneticData.kIndex}
                  max={9}
                  colorClass="bg-purple-500"
                />
              </div>

              {/* A-Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">A-Index</span>
                  </div>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {currentGeomagneticData.aIndex}/100
                  </span>
                </div>
                <IndexBar
                  value={currentGeomagneticData.aIndex}
                  max={100}
                  colorClass="bg-blue-500"
                />
              </div>

              {/* Space Weather Status */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Current Activity
                    </span>
                  </div>
                  <SpaceWeatherIndicator level={currentGeomagneticData.pastWeather.level} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Forecast</span>
                  </div>
                  <SpaceWeatherIndicator level={currentGeomagneticData.nextWeather.level} />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Source: </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <a
                  href={env.NOAA_GOV_CURRENT_RESOURCE_URL}
                  target="_blank"
                  className="text-blue-600 visited:text-purple-600 underline "
                >
                  {env.NOAA_GOV_CURRENT_RESOURCE_TITLE}
                </a>
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Details: </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <Link
                  to="/indicator-details"
                  className="ml-1 text-blue-500 hover:underline text-xs"
                >
                  Details
                </Link>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
