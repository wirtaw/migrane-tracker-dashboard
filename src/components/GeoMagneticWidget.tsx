import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useGeoMagneticWeather } from '../hooks/useGeoMagneticWeather.ts';

export default function GeoMagneticWidget() {
    const { geophysicalweather, loading, error } = useGeoMagneticWeather();

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

      if (error || !geophysicalweather) {
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
            <h2 className="text-lg font-semibold dark:text-white">Environmental Factors</h2>
          </div>
    
          <div className="grid grid-cols-2 gap-4">
    
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