import { useState, useEffect } from 'react';
import { GeophysicalWeatherData, fetchGeophysicalWeatherData } from '../services/weather.ts';

export function useGeoMagneticWeather() {
  const [geophysicalweather, setGeophysicalWeather] = useState<GeophysicalWeatherData>({
    solarFlux: 0,
    aIndex: 0,
    kIndex: -1,
    pastWeather: { level: '' },
    nextWeather: { level: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGetGeophysicalWeather, setCanGetGeophysicalWeather] = useState<boolean | null>(true);

  useEffect(() => {
    async function getWeatherData() {
      try {
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
        setError(`Failed to fetch weather data. ${JSON.stringify(err)}`);
        console.error(err);
      } finally {
        setCanGetGeophysicalWeather(false);
        setLoading(false);
      }
    }

    getWeatherData();
  });

  return { geophysicalweather, loading, error };
}
