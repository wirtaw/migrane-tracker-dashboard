import { useState, useEffect } from 'react';
import { WeatherData, fetchWeatherData, GeophysicalWeatherData, fetchGeophysicalWeatherData } from '../services/weather.ts';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [geophysicalweather, setGeophysicalWeather] = useState<GeophysicalWeatherData>({
    solarFlux: 0,
    aIndex: 0,
    kIndex: -1,
    pastSpaceWeather: '',
    nextSpaceWeather: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWeatherData() {
      try {
        setLoading(true);
        let data = null;
        if (!weather) {
          data = await fetchWeatherData();
          setWeather(data);
        }
        if (!geophysicalweather.solarFlux || geophysicalweather.kIndex < 0 || !geophysicalweather.aIndex) {
          data = await fetchGeophysicalWeatherData();
          setGeophysicalWeather(data);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getWeatherData();
  });

  return { weather, geophysicalweather, loading, error };
}