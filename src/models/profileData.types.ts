export interface ITrigger {
  id: number;
  userId: string;
  type: string;
  note: string;
  createdAt: Date;
  datetimeAt: Date;
}

export interface ISymptom {
  id: number;
  userId: string;
  type: string;
  severity: number;
  notes: string;
  createdAt: Date;
  datetimeAt: Date;
}

export interface IIncident {
  id: number;
  userId: string;
  type: string;
  startTime: Date;
  durationHours: number;
  notes: string;
  triggers: string[];
  createdAt: Date;
  datetimeAt: Date;
}

export interface IMedication {
  id: number;
  userId: string;
  title: string;
  dosage: string;
  notes: string;
  datetimeAt: Date;
  createdAt: Date;
  updateAt: Date;
}

export interface IWeight {
  id: number;
  userId: string;
  weight: number;
  notes: string;
  datetimeAt: Date;
}

export interface IHeight {
  id: number;
  userId: string;
  height: number;
  notes: string;
  datetimeAt: Date;
}

export interface IBloodPressure {
  id: number;
  userId: string;
  systolic: number;
  diastolic: number;
  notes: string;
  datetimeAt: Date;
}

export interface ISleep {
  id: number;
  userId: string;
  rate: number;
  notes: string;
  startedAt: Date;
  datetimeAt: Date;
}

export interface ISolar {
  kIndex: number | null;
  aIndex: number | null;
  flareProbability: number | null;
  datetime: string;
}

export interface IForecast {
  description: string;
  temperature: number | null;
  pressure: number | null;
  humidity: number | null;
  windSpeed: number | null;
  clouds: number | null;
  uvi: number | null;
  datetime: string;
}

export interface ISolarRadiation {
  uviIndex: number | null;
  ozone: number | null;
  solarFlux: number | null;
  sunsPotNumber: number | null;
  date: string;
}

export interface ILocationData {
  id: number;
  userId: string;
  latitude: number;
  longitude: number;
  forecast: IForecast[] | [];
  solar: ISolar[] | [];
  solarRadiation: ISolarRadiation[] | [];
  datetimeAt: Date;
  incidentId: number | null;
}

export interface IProfileSettingsData {
  userId: string;
  longitude: string;
  latitude: string;
  birthDate: string;
  emailNotifications: boolean;
  dailySummary: boolean;
  personalHealthData: boolean;
  securitySetup: boolean;
  profileFilled: boolean;
  salt: string;
  key: string;
  fetchDataErrors: {
    forecast: string;
    magneticWeather: string;
  };
  fetchMagneticWeather: boolean;
  fetchWeather: boolean;
}

export interface ProfileSecurityData {
  userId: string;
  password: string;
  salt: string;
  key: string;
  isInit: boolean;
}

export interface IErrorMessage {
  showModal: boolean;
  message: string;
}

export interface IBrokenTrigger {
  id: number;
  userId: string;
  type: string;
  note: string;
  createdAt: Date;
  datetimeAt: Date;
  warning: string;
}

export interface IBrokenSymptom {
  id: number;
  userId: string;
  type: string;
  severity: number;
  notes: string;
  createdAt: Date;
  datetimeAt: Date;
  warning: string;
}

export interface IBrokenIncident {
  id: number;
  userId: string;
  type: string;
  startTime: Date;
  durationHours: number;
  notes: string;
  triggers: string[];
  createdAt: Date;
  datetimeAt: Date;
  warning: string;
}

export interface IBrokenMedication {
  id: number;
  userId: string;
  title: string;
  dosage: string;
  notes: string;
  datetimeAt: Date;
  createdAt: Date;
  updateAt: Date;
  warning: string;
}

export interface IBrokenLocation {
  id: number;
  userId: string;
  latitude: number;
  longitude: number;
  forecast: IForecast[] | [];
  solar: ISolar[] | [];
  solarRadiation: ISolarRadiation[] | [];
  datetimeAt: Date;
  incidentId: number | null;
  warning: string;
}

export interface IBrokenData {
  triggers: IBrokenTrigger[] | unknown;
  incidents: IBrokenIncident[] | unknown;
  symptoms: IBrokenSymptom[] | unknown;
  medications: IBrokenMedication[] | unknown;
  locations: IBrokenLocation[] | unknown;
}

export interface IJSONData {
  triggers: ITrigger[];
  incidents: IIncident[];
  symptoms: ISymptom[];
  medications: IMedication[];
  logsForecast: ILocationData[] | unknown;
  logHealth:
    | {
        weight: IWeight[] | unknown;
        height: IHeight[] | unknown;
        bloodPresure: IBloodPressure[] | unknown;
        sleep: ISleep[] | unknown;
      }
    | unknown;
}

export interface IForecastHistoricalParams {
  latitude: number;
  longitude: number;
  dateTime: Date;
}

export interface ISolarHistoricalParams {
  dateTime: Date;
}

export interface ITyramineContentItem {
  product: string;
  allowedUse: string;
  limitedUse: string;
  striclyProhibitedUse: string;
}

export interface IApiSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}
