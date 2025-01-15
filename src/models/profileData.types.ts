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
