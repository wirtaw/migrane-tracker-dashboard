import { fetchWeatherApi } from 'openmeteo';
import { env } from '../config/env';

interface IOpenMeteoParams {
  latitude: number;
  longitude: number;
  current: Array<string>;
  daily: Array<string>;
  wind_speed_unit: string;
}

interface IOpenMeteoArchiveParams {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  hourly: Array<string>;
  daily: Array<string> | unknown;
  wind_speed_unit: string;
  timezone: string;
}

interface IWeatherResponse {
  alerts: Array<{
    description: string;
    start: number;
    end: number;
    event: string;
    sender_name: string;
  }>;
  current: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    clouds: number;
    uvi: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
}

export interface IWeatherData {
  temperature: number | undefined;
  humidity: number | undefined;
  pressure: number | undefined;
  feels_like: number | undefined;
  wind_speed_10m: number | undefined;
  clouds: number | undefined;
  uvi: number | undefined;
  description: string;
  icon: string;
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

const OPEN_WEATHER_BASE_URL: string = env.OPEN_WEATHER_BASE_URL;

const OPEN_METEO_BASE_URL: string = env.OPEN_METEO_BASE_URL;
const OPEN_METEO_ARCHIVE_URL: string = env.OPEN_METEO_ARCHIVE_URL;

export async function fetchWeatherData({
  latitude,
  longitude,
}: ICoordinates): Promise<IWeatherData> {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&units=${env.WEATHER_UNITS}&exclude=hourly,daily&appid=${env.OPEN_WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data: IWeatherResponse = await response.json();

    const weather: IWeatherData = {
      temperature: Math.round(data.current.temp),
      humidity: data.current.humidity,
      pressure: data.current.pressure,
      feels_like: Math.round(data.current.feels_like),
      wind_speed_10m: 0,
      clouds: data.current.clouds,
      uvi: data.current.uvi,
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
      alerts: data.alerts,
    };

    return weather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function fetchOpenMeteoWeatherData({
  latitude,
  longitude,
}: ICoordinates): Promise<IWeatherData> {
  try {
    const params: IOpenMeteoParams = {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'rain',
        'showers',
        'weather_code',
        'cloud_cover',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ],
      daily: ['uv_index_max', 'precipitation_sum', 'rain_sum'],
      wind_speed_unit: 'ms',
    };
    const responses = await fetchWeatherApi(OPEN_METEO_BASE_URL, params);

    if (!responses) {
      throw new Error('Weather data fetch failed');
    }

    const [response] = responses;

    const current = response.current()!;
    const daily = response.daily()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const time = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
      t => new Date((t + utcOffsetSeconds) * 1000)
    );

    const uvIndexMax = daily.variables(0)!.valuesArray()!;

    const weather: IWeatherData = {
      temperature: Math.round(current.variables(0)!.value()),
      humidity: current.variables(1)!.value(),
      pressure: Math.round(current.variables(8)!.value()),
      feels_like: Math.round(current.variables(2)!.value()),
      wind_speed_10m: Math.round(current.variables(9)!.value()),
      clouds: current.variables(7)!.value(),
      uvi: Math.round(uvIndexMax.reduce((acc, prev) => acc + prev, 0) / time.length),
      description: '',
      icon: '',
      alerts: [],
    };

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

export async function fetchOpenMeteoWeatherDataHistorical({
  latitude,
  longitude,
  dateTime,
}: ICoordinatesWithDate): Promise<IWeatherData | undefined> {
  try {
    if (typeof dateTime === 'undefined') {
      return;
    }
    const params: IOpenMeteoArchiveParams = {
      latitude,
      longitude,
      start_date: getDateRange(dateTime),
      end_date: getDateRange(dateTime),
      hourly: [
        'temperature_2m',
        'wind_speed_10m',
        'precipitation',
        'relative_humidity_2m',
        'cloud_cover',
        'pressure_msl_spread',
      ],
      daily: '',
      wind_speed_unit: 'ms',
      timezone: 'auto',
    };
    const responses = await fetchWeatherApi(OPEN_METEO_ARCHIVE_URL, params);

    if (!responses) {
      throw new Error('Weather data fetch failed');
    }

    const [response] = responses;

    const hourly = response.hourly()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const time = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
      t => new Date((t + utcOffsetSeconds) * 1000)
    );

    const temperature2m = hourly.variables(0)!.valuesArray()!;
    const windSpeed10m = hourly.variables(1)!.valuesArray()!;
    const relativeHumidity2m = hourly.variables(3)!.valuesArray()!;
    const cloudCover = hourly.variables(4)!.valuesArray()!;
    const pressureMslSpread = hourly.variables(5)!.valuesArray()!;

    const isTemperatureValuesValid: boolean =
      temperature2m.filter(item => !Number.isNaN(item)).length === temperature2m.length;
    const isWindValuesValid: boolean =
      windSpeed10m.filter(item => !Number.isNaN(item)).length === windSpeed10m.length;
    const isHumidityValuesValid: boolean =
      relativeHumidity2m.filter(item => !Number.isNaN(item)).length === relativeHumidity2m.length;
    const isCloudCoverValuesValid: boolean =
      cloudCover.filter(item => !Number.isNaN(item)).length === cloudCover.length;
    const isPressureValuesValid: boolean =
      pressureMslSpread.filter(item => !Number.isNaN(item)).length === pressureMslSpread.length;

    const weather: IWeatherData = {
      temperature: isTemperatureValuesValid
        ? Math.round(temperature2m.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      humidity: isHumidityValuesValid
        ? Math.round(relativeHumidity2m.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      pressure: isPressureValuesValid
        ? Math.round(pressureMslSpread.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      feels_like: undefined,
      wind_speed_10m: isWindValuesValid
        ? Math.round(windSpeed10m.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      clouds: isCloudCoverValuesValid
        ? Math.round(cloudCover.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      uvi: undefined,
      description: '',
      icon: '',
      alerts: [],
    };

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
