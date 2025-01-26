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

export interface Location {
  latitude: number;
  longitude: number;
  forecast: {
    description: string;
    temperature: number;
    pressure: number;
    humidity: number;
    windSpeed: number;
  };
  solar: {
    kIndex: number;
    aIndex: number;
    bIndex: number;
    flareProbability: number;
  };
  datetimeAt: Date;
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
  salt: string;
  key: string;
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
