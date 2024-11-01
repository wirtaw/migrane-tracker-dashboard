import { useState, useEffect } from 'react';
import { WeatherData, fetchWeatherData } from '../services/weather.ts';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWeatherData() {
      try {
        setLoading(true);
        // Default coordinates (can be updated with geolocation)
        const data = await fetchWeatherData();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getWeatherData();
  }, []);

  return { weather, loading, error };
}