import React from 'react';
import { Cloud, Sun, Thermometer, AlertCircle, CloudCog, Sparkle, SunDim } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

export default function WeatherWidget() {
  const { weather, geophysicalweather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather || !geophysicalweather) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">Failed to load weather data. {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold dark:text-white">Environmental Factors</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
              <div className="font-semibold dark:text-white">{weather.temperature} °C</div>
              <div className="font-semibold dark:text-white">{weather.feels_like} °C (feels like)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sparkle className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
              <div className="font-semibold dark:text-white">{weather.humidity} %</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CloudCog className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pressure</div>
              <div className="font-semibold dark:text-white">{weather.pressure} hPa</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Clouds</div>
              <div className="font-semibold dark:text-white">{weather.clouds} %</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SunDim className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uvi</div>
              <div className="font-semibold dark:text-white">{weather.uvi}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
          
            <div className="text-sm text-gray-600 dark:text-gray-400">Description</div>
            <div className="font-semibold dark:text-white">{weather.description}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Solar Flux {geophysicalweather.solarFlux}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i+31}
                  className={`w-2 h-8 rounded-full ${
                    i+31 < geophysicalweather.solarFlux
                      ? 'bg-yellow-400 dark:bg-yellow-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Magnetic Index (k Index) {geophysicalweather.kIndex}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-8 rounded-full ${
                    i < geophysicalweather.kIndex
                      ? 'bg-purple-400 dark:bg-purple-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Magnetic Index (A Index) {geophysicalweather.aIndex}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i+21}
                  className={`w-2 h-8 rounded-full ${
                    i+21 < geophysicalweather.aIndex
                      ? 'bg-red-400 dark:bg-red-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Past Space Weather</div>
            <div className="flex items-center gap-1">
              {geophysicalweather.pastSpaceWeather}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Next Space Weather</div>
            <div className="flex items-center gap-1">
              {geophysicalweather.nextSpaceWeather}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}