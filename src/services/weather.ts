import { env } from '../config/env';

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  solarActivity: number;
  magneticIndex: number;
}

const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/weather?lat=${env.LATITUDE}&lon=${env.LONGITUDE}&units=${env.WEATHER_UNITS}&appid=${env.OPEN_WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data: WeatherResponse = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      // Mock data for now - these would come from separate APIs
      solarActivity: 4.2,
      magneticIndex: 3,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}