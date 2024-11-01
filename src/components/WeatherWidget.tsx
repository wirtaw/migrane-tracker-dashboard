import React from 'react';
import { Cloud, Sun, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  solarActivity: number;
  magneticIndex: number;
}

// Mock data - In production, this would come from a weather API
const mockWeatherData: WeatherData = {
  temperature: 22,
  humidity: 65,
  pressure: 1013,
  solarActivity: 4.2,
  magneticIndex: 3,
};

export default function WeatherWidget() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Environmental Factors</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm text-gray-600">Temperature</div>
              <div className="font-semibold">{mockWeatherData.temperature}°C</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="font-semibold">{mockWeatherData.humidity}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600">Solar Activity</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-8 rounded-full ${
                    i < mockWeatherData.solarActivity
                      ? 'bg-yellow-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Magnetic Index</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-8 rounded-full ${
                    i < mockWeatherData.magneticIndex
                      ? 'bg-purple-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}