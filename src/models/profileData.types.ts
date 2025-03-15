export interface Trigger {
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

export interface LocationData {
  id: number;
  latitude: number;
  longitude: number;
  forecast: {
    description: string;
    temperature: number;
    pressure: number;
    humidity: number;
    windSpeed: number;
    clouds: number;
    uvi: number;
  };
  solar: {
    solarFlux: number | null;
    kIndex: number | null;
    aIndex: number | null;
    bIndex: number | null;
    flareProbability: number | null;
  };
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

export interface ErrorMessage {
  showModal: boolean;
  message: string;
}

export interface BrokenTrigger {
  id: number;
  userId: string;
  type: string;
  note: string;
  createdAt: Date;
  datetimeAt: Date;
  warning: string;
}

export interface BrokenSymptom {
  id: number;
  userId: string;
  type: string;
  severity: number;
  notes: string;
  createdAt: Date;
  datetimeAt: Date;
  warning: string;
}

export interface BrokenIncident {
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

export interface BrokenMedication {
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

export interface BrokenData {
  triggers: BrokenTrigger[] | unknown;
  incidents: BrokenIncident[] | unknown;
  symptoms: BrokenSymptom[] | unknown;
  medications: BrokenMedication[] | unknown;
}

export interface JSONData {
  triggers: Trigger[];
  incidents: Incident[];
  symptoms: Symptom[];
  medications: Medication[];
  logsForecast: LocationData[] | unknown;
  logHealth:
    | {
        weight: Weight[] | unknown;
        height: Height[] | unknown;
        bloodPresure: BloodPressure[] | unknown;
        sleep: Sleep[] | unknown;
      }
    | unknown;
}
