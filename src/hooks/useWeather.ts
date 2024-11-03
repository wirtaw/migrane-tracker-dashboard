import { useState, useEffect } from 'react';
import { WeatherData, fetchWeatherData } from '../services/weather.ts';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGetWeather, setCanGetWeather] = useState<boolean | null>(true);

  useEffect(() => {
    async function getWeatherData() {
      try {
        setLoading(true);
        let data = null;
        if (!weather && canGetWeather) {
          data = await fetchWeatherData();
          setWeather(data);
        }
        setError(null);
      } catch (err) {
        setError(`Failed to fetch weather data. ${JSON.stringify(err)}`);
        setCanGetWeather(false);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getWeatherData();
  });

  return { weather, loading, error };
}