export interface ITrigger {
  id: number;
  userId: string;
  type: string;
  note: string;
  createdAt: Date;
  datetimeAt: Date;
}

export interface Symptom {
  id: number;
  userId: string;
  type: string;
  severity: number;
  notes: string;
  createdAt: Date;
  datetimeAt: Date;
}

export interface Incident {
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

export interface Medication {
  id: number;
  userId: string;
  title: string;
  dosage: string;
  notes: string;
  datetimeAt: Date;
  createdAt: Date;
  updateAt: Date;
}

export interface Weight {
  id: number;
  userId: string;
  weight: number;
  notes: string;
  datetimeAt: Date;
}

export interface Height {
  id: number;
  userId: string;
  height: number;
  notes: string;
  datetimeAt: Date;
}

export interface BloodPressure {
  id: number;
  userId: string;
  systolic: number;
  diastolic: number;
  notes: string;
  datetimeAt: Date;
}

export interface Sleep {
  id: number;
  userId: string;
  rate: number;
  notes: string;
  startedAt: Date;
  datetimeAt: Date;
}

export interface ISolar {
  solarFlux: number | null;
  kIndex: number | null;
  aIndex: number | null;
  bIndex: number | null;
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
  datetime: string;
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

export interface ProfileSettingsData {
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

export interface BrokenData {
  triggers: IBrokenTrigger[] | unknown;
  incidents: IBrokenIncident[] | unknown;
  symptoms: IBrokenSymptom[] | unknown;
  medications: IBrokenMedication[] | unknown;
  locations: IBrokenLocation[] | unknown;
}

export interface JSONData {
  triggers: ITrigger[];
  incidents: Incident[];
  symptoms: Symptom[];
  medications: Medication[];
  logsForecast: ILocationData[] | unknown;
  logHealth:
    | {
        weight: Weight[] | unknown;
        height: Height[] | unknown;
        bloodPresure: BloodPressure[] | unknown;
        sleep: Sleep[] | unknown;
      }
    | unknown;
}

export interface ForecastHistoricalParams {
  latitude: number;
  longitude: number;
  dateTime: Date;
}

export interface SolarHistoricalParams {
  dateTime: Date;
}
