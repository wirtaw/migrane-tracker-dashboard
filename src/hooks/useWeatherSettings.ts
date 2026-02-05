import { useState, useEffect } from 'react';

export interface WeatherSettings {
  showTemperature: boolean;
  showHumidity: boolean;
  showPressure: boolean; // Useful for migraine tracking
  showPrecipitation: boolean;
}

const DEFAULT_SETTINGS: WeatherSettings = {
  showTemperature: true,
  showHumidity: true,
  showPressure: true,
  showPrecipitation: true,
};

export const useWeatherSettings = () => {
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    const saved = localStorage.getItem('weatherSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof WeatherSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return { settings, toggleSetting };
};
