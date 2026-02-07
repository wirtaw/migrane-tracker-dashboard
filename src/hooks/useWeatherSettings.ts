import { useState, useEffect } from 'react';

export interface WeatherSettings {
  showTemperature: boolean;
  showHumidity: boolean;
  showPressure: boolean; // Useful for migraine tracking
  showPrecipitation: boolean;
  showCloudCover: boolean;
  forecastDuration: 24 | 48 | 72;
}

const DEFAULT_SETTINGS: WeatherSettings = {
  showTemperature: true,
  showHumidity: true,
  showPressure: true,
  showPrecipitation: true,
  showCloudCover: true,
  forecastDuration: 48,
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

  const updateSetting = <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, toggleSetting, updateSetting };
};
