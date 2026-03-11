import { env } from '../config/env';
import { IMedication } from '../models/profileData.types';
import { checkUsageLimit, handleResponseError } from './api-utils';

export interface CreateMedicationDto {
  userId: string;
  title: string;
  dosage: string;
  notes?: string;
  datetimeAt: string;
}

export type UpdateMedicationDto = Partial<CreateMedicationDto>;

interface ApiMedicationResponse extends Omit<IMedication, 'createdAt' | 'datetimeAt' | 'updateAt'> {
  createdAt: string;
  datetimeAt: string;
  updateAt: string;
}

const parseMedicationDates = (medication: ApiMedicationResponse): IMedication => {
  return {
    ...medication,
    createdAt: new Date(medication.createdAt),
    datetimeAt: new Date(medication.datetimeAt),
    updateAt: new Date(medication.updateAt),
  };
};

export async function fetchMedications(token: string): Promise<IMedication[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Medication fetch failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/medications`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to fetch medications');
  }

  const data = await response.json();
  return data.map(parseMedicationDates);
}

export async function createMedication(
  dto: CreateMedicationDto,
  token: string
): Promise<IMedication> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Create medication failed: Missing configuration or token');
  }
  // Limit DB records to 10 for open-source version
  if (!checkUsageLimit('db_records_medications', 10)) {
    throw new Error('Database limit reached. Use Migraine Pulse for unlimited storage.');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/medications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to create medication');
  }

  const data = await response.json();
  return parseMedicationDates(data);
}

export async function updateMedication(
  id: string,
  dto: UpdateMedicationDto,
  token: string
): Promise<IMedication> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Update medication failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/medications/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to update medication');
  }

  const data = await response.json();
  return parseMedicationDates(data);
}

export async function deleteMedication(id: string, token: string): Promise<void> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Delete medication failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/medications/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to delete medication');
  }
}

export async function fetchMedicationTitles(token: string): Promise<string[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch medication titles failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/medications/titles`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to fetch medication titles');
  }

  return response.json();
}
