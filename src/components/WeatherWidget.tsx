import React from 'react';
import {
  Sun,
  Thermometer,
  AlertCircle,
  Droplets,
  Gauge,
  CloudSun,
  UmbrellaIcon,
} from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

function UVIndexIndicator({ uvi }: { uvi: number }) {
  const getUVIColor = (uvi: number) => {
    if (uvi <= 2) return 'bg-green-500';
    if (uvi <= 5) return 'bg-yellow-500';
    if (uvi <= 7) return 'bg-orange-500';
    if (uvi <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getUVIText = (uvi: number) => {
    if (uvi <= 2) return 'Low';
    if (uvi <= 5) return 'Moderate';
    if (uvi <= 7) return 'High';
    if (uvi <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getUVIColor(uvi)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getUVIText(uvi)}</span>
    </div>
  );
}

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultWeather = {
    temperature: 20,
    feels_like: 10,
    humidity: 65,
    pressure: 1013,
    description: 'Clear sky',
    icon: '01d',
    clouds: 20,
    uvi: 4.5,
  };

  const currentWeather = error ? defaultWeather : { ...defaultWeather, ...weather };

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
      </div>

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
              <span className="font-medium dark:text-gray-300">{currentWeather.feels_like}°C</span>
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
                <span className="text-xl font-semibold dark:text-white">{currentWeather.uvi}</span>
                <UVIndexIndicator uvi={currentWeather.uvi} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg">
            <CloudSun className="w-5 h-5 text-sky-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cloud Cover</div>
              <div className="text-xl font-semibold dark:text-white">{currentWeather.clouds}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
