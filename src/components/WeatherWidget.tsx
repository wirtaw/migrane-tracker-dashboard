import { useEffect, useState } from 'react';
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
import { IWeatherData, IForecastResponse, getForecast } from '../services/weather';
import UVIndexIndicator from '../components/indicators/UVIndexIndicator';
import { useWeatherSettings } from '../hooks/useWeatherSettings';
import WeatherForecastChart from './charts/WeatherForecastChart';
import WeatherForecastCard from './cards/WeatherForecastCard';

interface IWeatherWidgetProps {
  data?: IWeatherData;
}

export default function WeatherWidget({ data }: IWeatherWidgetProps) {
  const { weatherState, fetchForecast, profileSettingsData } = useAuth();
  const { settings } = useWeatherSettings();
  const [forecast, setForecast] = useState<IForecastResponse | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [activeChart, setActiveChart] = useState<
    'temperature' | 'humidity' | 'pressure' | 'cloudCover'
  >('temperature');
  const { apiSession } = useAuth();

  const isLoading = data ? false : weatherState.loading;

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        const lat = profileSettingsData?.latitude;
        const lon = profileSettingsData?.longitude;

        const forecastData = await getForecast(
          { latitude: parseFloat(lat), longitude: parseFloat(lon) },
          apiSession?.accessToken
        );
        setForecast(forecastData);
      } catch (err) {
        console.error('Failed to fetch forecast:', err);
      } finally {
        setLoadingForecast(false);
      }
    };

    fetchWeatherForecast();
  }, [profileSettingsData]);

  if (isLoading) {
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
    alerts: [],
  };

  const currentWeather = data
    ? data
    : weatherState.error || !weatherState.data
      ? defaultWeather
      : { ...defaultWeather, ...weatherState.data };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-8">
      {/* Current Weather Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold dark:text-white">Weather</h2>
          </div>
          {!data && weatherState.error && (
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
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => fetchForecast(profileSettingsData)}
                />
              </p>
            </div>
          )}
        </div>

        {currentWeather?.temperature !== undefined &&
          currentWeather?.feels_like !== undefined &&
          currentWeather?.humidity !== undefined && (
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
                        <UVIndexIndicator uvi={currentWeather.uvi || 0} showDetails={false} />
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
                    rel="noreferrer"
                    className="text-blue-600 visited:text-purple-600 underline "
                  >
                    {env.OPEN_METEO_RESOURCE_TITLE}
                  </a>
                </div>
              </div>
            </>
          )}
      </div>

      {/* Forecast Section */}
      {forecast && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Forecast</h3>

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              {settings.forecastDuration}-Hour Trend
            </h4>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {settings.showTemperature && (
                <button
                  onClick={() => setActiveChart('temperature')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeChart === 'temperature'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Temperature
                </button>
              )}
              {settings.showHumidity && (
                <button
                  onClick={() => setActiveChart('humidity')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeChart === 'humidity'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Humidity
                </button>
              )}
              {settings.showPressure && (
                <button
                  onClick={() => setActiveChart('pressure')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeChart === 'pressure'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Pressure
                </button>
              )}
              {settings.showCloudCover && (
                <button
                  onClick={() => setActiveChart('cloudCover')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeChart === 'cloudCover'
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Cloud Cover
                </button>
              )}
            </div>

            <div className="h-64 w-full">
              <WeatherForecastChart
                data={forecast.hourly}
                type={activeChart}
                duration={settings.forecastDuration}
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Daily Outlook
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {forecast.daily.map((day, i) => (
                <WeatherForecastCard key={i} data={day} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
