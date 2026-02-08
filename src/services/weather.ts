import { env } from '../config/env';

export interface IWeatherData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  feels_like?: number;
  wind_speed_10m?: number;
  clouds?: number;
  uvi?: number;
  description: string;
  icon: string; // Mapped from OpenMeteo weather code
  alerts: Array<{
    description: string;
    start: number;
    end: number;
    event: string;
    sender_name: string;
  }>;
}

export interface NextWeather {
  kpIndex: {
    observed: string;
    expected: string;
    rationale: string;
  };
  solarRadiation: {
    rationale: string;
  };
  radioBlackout: {
    rationale: string;
  };
}

export interface IGeophysicalWeatherData {
  solarFlux: number;
  aIndex: number;
  kIndex: number;
  pastWeather: { level: string };
  nextWeather: NextWeather;
}

interface ICoordinates {
  latitude: number;
  longitude: number;
}

interface ICoordinatesWithDate {
  latitude: number;
  longitude: number;
  dateTime: Date;
}

export interface IRadiationTodayData {
  date: string;
  UVIndex: number;
  ozone: number;
  kpIndex?: number;
  aRunning?: number;
  Kp1?: number;
  Kp2?: number;
  Kp3?: number;
  Kp4?: number;
  Kp5?: number;
  Kp6?: number;
  Kp7?: number;
  Kp8?: number;
  ap1?: number;
  ap2?: number;
  ap3?: number;
  ap4?: number;
  ap5?: number;
  ap6?: number;
  ap7?: number;
  ap8?: number;
  solarFlux?: number;
  sunsPotNumber?: number;
}

export async function fetchOpenMeteoWeatherData(
  { latitude, longitude }: ICoordinates,
  token?: string
): Promise<IWeatherData> {
  try {
    if (!env.MIGRAINE_BACKEND_API_URL || !token) {
      throw new Error('Weather data fetch failed: Missing configuration or token');
    }

    const response = await fetch(
      `${env.MIGRAINE_BACKEND_API_URL}/api/v1/weather?latitude=${latitude}&longitude=${longitude}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const weather: IWeatherData = await response.json();

    return weather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchGeophysicalWeatherData(
  token?: string
): Promise<IGeophysicalWeatherData> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    return {
      solarFlux: 0,
      aIndex: 0,
      kIndex: 0,
      pastWeather: { level: '' },
      nextWeather: {
        kpIndex: { observed: '', expected: '', rationale: '' },
        solarRadiation: { rationale: '' },
        radioBlackout: { rationale: '' },
      },
    };
  }

  const dateStr = getDateRange(new Date());

  const responseGeoActivity = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/solar/geophysical/historical?date=${dateStr}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!responseGeoActivity.ok) {
    throw new Error('Weather data fetch failed');
  }

  const geoActivityData: IGeophysicalWeatherData = await responseGeoActivity.json();

  return geoActivityData;
}

const getDateRange = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const date = dateTime.getDate();

  return `${year}-${month < 9 ? `0${month}` : month}-${date < 9 ? `0${date}` : date}`;
};

export async function fetchOpenMeteoWeatherDataHistorical(
  { latitude, longitude, dateTime }: ICoordinatesWithDate,
  token?: string
): Promise<IWeatherData | undefined> {
  try {
    if (typeof dateTime === 'undefined') {
      return;
    }

    if (!env.MIGRAINE_BACKEND_API_URL || !token) {
      return;
    }

    const dateStr = getDateRange(dateTime);

    const response = await fetch(
      `${env.MIGRAINE_BACKEND_API_URL}/api/v1/weather/historical?latitude=${latitude}&longitude=${longitude}&date=${dateStr}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const weather: IWeatherData = await response.json();

    return weather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchGeophysicalWeatherDataHistorical(
  dateTime: Date,
  token: string
): Promise<IGeophysicalWeatherData> {
  const dateStr = getDateRange(dateTime);

  const responseGeoActivity = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/solar/geophysical/historical?date=${dateStr}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!responseGeoActivity.ok) {
    throw new Error('Geophysical weather data fetch failed');
  }

  const geoActivityData: IGeophysicalWeatherData = await responseGeoActivity.json();

  return geoActivityData;
}

export async function fetchRadiationWeatherData(
  { latitude, longitude }: ICoordinates,
  token?: string
): Promise<IRadiationTodayData[] | []> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    return [];
  }

  const responseRadiation = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/solar?latitude=${latitude}&longitude=${longitude}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!responseRadiation.ok) {
    throw new Error('Radiation weather data fetch failed');
  }

  const responseRadiationData = await responseRadiation.json();

  return responseRadiationData;
}

export interface IHourlyForecast {
  time: Date;
  temperature: number;
  humidity: number;
  weatherCode: number;
  cloudCover: number;
  surfacePressure: number;
  uvIndex?: number;
}

export interface IDailyForecast {
  date: Date;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationSum: number;
}

export interface IForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: IHourlyForecast[];
  daily: IDailyForecast[];
}

export const getForecast = async (
  { latitude, longitude }: ICoordinates,
  token?: string
): Promise<IForecastResponse> => {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    return {
      latitude: 0,
      longitude: 0,
      timezone: '',
      hourly: [],
      daily: [],
    };
  }

  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/weather/forecast?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast');
  }

  const data = await response.json();

  if (!data || !data.hourly || !data.daily) {
    console.error('Failed to fetch forecast: Invalid data');
    return {
      latitude: 0,
      longitude: 0,
      timezone: '',
      hourly: [],
      daily: [],
    };
  }

  return {
    ...data,
    hourly: data.hourly.map((h: { time: string }) => ({ ...h, time: new Date(h.time) })),
    daily: data.daily.map((d: { date: string }) => ({ ...d, date: new Date(d.date) })),
  };
};
