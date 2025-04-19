import React from 'react';
import {
  Sun,
  Thermometer,
  AlertCircle,
  Droplets,
  Gauge,
  CloudSun,
  UmbrellaIcon,
  RefreshCcw,
  Wind,
} from 'lucide-react';
import { env } from '../config/env';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import UVIndexIndicator from '../components/indicators/UVIndexIndicator';

export default function WeatherWidget() {
  const {
    forecastData,
    weatherLoading: loading,
    forecastError: error,
    fetchForecast,
    profileSettingsData,
  } = useAuth();

  if (loading) {
    return <Loader />;
  }

  const defaultWeather = {
    temperature: undefined,
    feels_like: undefined,
    humidity: undefined,
    pressure: undefined,
    description: undefined,
    wind_speed_10m: undefined,
    icon: undefined,
    clouds: undefined,
    uvi: undefined,
  };

  const currentWeather =
    error || !forecastData ? defaultWeather : { ...defaultWeather, ...forecastData };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold dark:text-white">Weather</h2>
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
            <RefreshCcw className="w-3 h-3 " onClick={() => fetchForecast(profileSettingsData)} />
          </p>
        </div>
      </div>

      {currentWeather?.temperature && currentWeather?.feels_like && currentWeather?.humidity && (
        <>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
                    <div className="text-2xl font-bold dark:text-white">
                      {currentWeather.temperature}°C
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 pl-9">
                  Feels like{' '}
                  <span className="font-medium dark:text-gray-300">
                    {currentWeather.feels_like}°C
                  </span>
                </div>
              </div>
              {currentWeather.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                  alt={currentWeather.description}
                  className="w-16 h-16"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                  <div className="text-xl font-semibold dark:text-white">
                    {currentWeather.humidity}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                <Gauge className="w-5 h-5 text-teal-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pressure</div>
                  <div className="text-xl font-semibold dark:text-white">
                    {currentWeather.pressure} hPa
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
                <UmbrellaIcon className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">UV Index</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold dark:text-white">
                      {currentWeather.uvi}
                    </span>
                    <UVIndexIndicator uvi={currentWeather.uvi} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg">
                <Wind className="w-5 h-5 text-sky-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wind speed</div>
                  <div className="text-xl font-semibold dark:text-white">
                    {currentWeather.wind_speed_10m} m/s
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg">
                <CloudSun className="w-5 h-5 text-sky-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cloud Cover</div>
                  <div className="text-xl font-semibold dark:text-white">
                    {currentWeather.clouds}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Source: </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <a
                href={env.OPEN_METEO_RESOURCE_URL}
                target="_blank"
                className="text-blue-600 visited:text-purple-600 underline "
              >
                {env.OPEN_METEO_RESOURCE_TITLE}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
