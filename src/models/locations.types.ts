export interface IOpenMeteoData {
  clouds: number;
  datetime: string;
  description: string;
  directRadiation: number;
  humidity: number;
  pressure: number;
  temperature: number;
  windSpeed: number;
  uvi: number;
}

export interface IPlanetaryKindexMappedData {
  aIndex: number;
  datetime: string;
  flareProbability: number | null;
  kIndex: number;
}

export interface IRadiationMappedData {
  date: string; // "dd LLL yyyy" format in response, but raw data might be yyyyMMdd
  ozone: number;
  solarFlux: number;
  sunsPotNumber: number;
  uviIndex?: number;
  uvIndex?: number; // Legacy support
}

export interface ISummaryResponse {
  datetimeAt: string; // ISO String
  id?: string;
  incidentId?: string;
  latitude: number;
  longitude: number;
  userId: string;
  forecast: IOpenMeteoData[];
  solar: IPlanetaryKindexMappedData[];
  solarRadiation: IRadiationMappedData[];
}

export interface IForecastDto {
  datetime: string;
  description?: string;
  temperature?: number;
  pressure?: number;
  humidity?: number;
  windSpeed?: number;
  clouds?: number;
  uvi?: number;
  directRadiation?: number;
}

export interface ISolarDto {
  datetime: string;
  kIndex?: number;
  aIndex?: number;
  flareProbability?: number;
}

export interface ISolarRadiationDto {
  date: string;
  uviIndex?: number;
  ozone?: number;
  solarFlux?: number;
  sunsPotNumber?: number;
}

export interface CreateLocationDto {
  userId?: string; // Optional (inferred from token)
  latitude: number;
  longitude: number;
  datetimeAt: string; // ISO String
  incidentId?: string;
  forecast?: IForecastDto[];
  solar?: ISolarDto[];
  solarRadiation?: ISolarRadiationDto[];
}

export type UpdateLocationDto = Partial<CreateLocationDto>;
