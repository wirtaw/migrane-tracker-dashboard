import { env } from '../config/env';
import { ISymptom } from '../models/profileData.types';
import { checkUsageLimit, handleResponseError } from './api-utils';

export interface CreateSymptomDto {
  userId: string;
  type: string;
  severity: number;
  note?: string;
  datetimeAt: string;
}

export type UpdateSymptomDto = Partial<CreateSymptomDto>;

interface ApiSymptomResponse extends Omit<ISymptom, 'createdAt' | 'datetimeAt'> {
  createdAt: string;
  datetimeAt: string;
}

const parseSymptomDates = (symptom: ApiSymptomResponse): ISymptom => {
  return {
    ...symptom,
    createdAt: new Date(symptom.createdAt),
    datetimeAt: new Date(symptom.datetimeAt),
  };
};

export async function fetchSymptoms(token: string): Promise<ISymptom[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Symptom fetch failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/symptoms`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to fetch symptoms');
  }

  const data = await response.json();
  return data.map(parseSymptomDates);
}

export async function createSymptom(dto: CreateSymptomDto, token: string): Promise<ISymptom> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Create symptom failed: Missing configuration or token');
  }
  // Limit DB records to 10 for open-source version
  if (!checkUsageLimit('db_records_symptoms', 10)) {
    throw new Error('Database limit reached. Use Migraine Pulse for unlimited storage.');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/symptoms`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to create symptom');
  }

  const data = await response.json();
  return parseSymptomDates(data);
}

export async function updateSymptom(
  id: string,
  dto: UpdateSymptomDto,
  token: string
): Promise<ISymptom> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Update symptom failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/symptoms/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to update symptom');
  }

  const data = await response.json();
  return parseSymptomDates(data);
}

export async function deleteSymptom(id: string, token: string): Promise<void> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Delete symptom failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/symptoms/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to delete symptom');
  }
}

export async function fetchSymptomTypes(token: string): Promise<string[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Symptom types fetch failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/symptoms/types`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to fetch symptom types');
  }

  const data = await response.json();
  return data;
}
