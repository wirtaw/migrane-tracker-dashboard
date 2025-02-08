import { useState, useEffect } from 'react';
import { WeatherData, fetchOpenMeteoWeatherData } from '../services/weather.ts';
import { useProfileDataContext } from '../context/ProfileDataContext';

export function useWeather() {
  const { profileSettingsData, setProfileSettingsData } = useProfileDataContext();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(profileSettingsData.fetchDataErrors.forecast);
  const [canGetWeather, setCanGetWeather] = useState<boolean | null>(true);
  const [latitude] = useState<number>(parseFloat(profileSettingsData.latitude) || 0);
  const [longitude] = useState<number>(parseFloat(profileSettingsData.longitude) || 0);

  useEffect(() => {
    async function getWeatherData() {
      try {
        if (!latitude && !longitude) {
          setCanGetWeather(false);
          setLoading(false);
          const errMessage: string = 'Failed to fetch weather data. No provided coordinates';
          setError(errMessage);
          setProfileSettingsData({
            ...profileSettingsData,
            fetchDataErrors: {
              magneticWeather: profileSettingsData.fetchDataErrors.magneticWeather,
              forecast: errMessage,
            },
          });
          return;
        }
        setLoading(true);
        let data = null;
        if (!weather && canGetWeather) {
          data = await fetchOpenMeteoWeatherData({ latitude, longitude });
          setWeather(data);
        }
        setError(null);
      } catch (err) {
        const errMessage: string = `Failed to fetch weather data. ${JSON.stringify(err)}`;
        setError(errMessage);
        console.error(err);
        setProfileSettingsData({
          ...profileSettingsData,
          fetchDataErrors: {
            magneticWeather: profileSettingsData.fetchDataErrors.magneticWeather,
            forecast: errMessage,
          },
        });
      } finally {
        setCanGetWeather(false);
        setLoading(false);
      }
    }

    if (!profileSettingsData.fetchDataErrors.magneticWeather) {
      getWeatherData();
    }
  });

  return { weather, loading, error };
}
