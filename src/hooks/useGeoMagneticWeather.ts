import { useState, useEffect } from 'react';
import { GeophysicalWeatherData, fetchGeophysicalWeatherData } from '../services/weather.ts';
import { useProfileDataContext } from '../context/ProfileDataContext';

export function useGeoMagneticWeather() {
  const { profileSettingsData, setProfileSettingsData } = useProfileDataContext();
  const [geophysicalweather, setGeophysicalWeather] = useState<GeophysicalWeatherData>({
    solarFlux: 0,
    aIndex: 0,
    kIndex: -1,
    pastWeather: { level: '' },
    nextWeather: { level: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    profileSettingsData.fetchDataErrors.magneticWeather
  );
  const [canGetGeophysicalWeather, setCanGetGeophysicalWeather] = useState<boolean | null>(true);
  const [latitude] = useState<number>(parseFloat(profileSettingsData.latitude) || 0);
  const [longitude] = useState<number>(parseFloat(profileSettingsData.longitude) || 0);

  useEffect(() => {
    async function getWeatherData() {
      try {
        if (!latitude && !longitude) {
          setCanGetGeophysicalWeather(false);
          setLoading(false);
          const errMessage: string =
            'Failed to fetch geomagnetic activity data. No provided coordinates';
          setError(errMessage);
          setProfileSettingsData({
            ...profileSettingsData,
            fetchDataErrors: {
              magneticWeather: errMessage,
              forecast: profileSettingsData.fetchDataErrors.forecast,
            },
          });
          return;
        }
        setLoading(true);
        let data = null;

        if (
          (canGetGeophysicalWeather && !geophysicalweather.solarFlux) ||
          geophysicalweather.kIndex < 0 ||
          !geophysicalweather.aIndex
        ) {
          data = await fetchGeophysicalWeatherData();
          setGeophysicalWeather(data);
        }
        setError(null);
      } catch (err) {
        const errMessage: string = `Failed to fetch geomagnetic activity data. ${JSON.stringify(err)}`;
        setError(errMessage);
        setProfileSettingsData({
          ...profileSettingsData,
          fetchDataErrors: {
            magneticWeather: errMessage,
            forecast: profileSettingsData.fetchDataErrors.forecast,
          },
        });
        console.error(err);
      } finally {
        setCanGetGeophysicalWeather(false);
        setLoading(false);
      }
    }

    if (!profileSettingsData.fetchDataErrors.magneticWeather) {
      getWeatherData();
    }
  });

  return { geophysicalweather, loading, error };
}
