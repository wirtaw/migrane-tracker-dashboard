import { env } from '../config/env';
import { IWeight, IHeight, IBloodPressure } from '../models/profileData.types';

// DTOs
export interface CreateWeightDto {
  userId: string;
  weight: number;
  notes?: string;
  datetimeAt: string;
}

export interface CreateHeightDto {
  userId: string;
  height: number;
  notes?: string;
  datetimeAt: string;
}

export interface CreateBloodPressureDto {
  userId: string;
  systolic: number;
  diastolic: number;
  notes?: string;
  datetimeAt: string;
}

export interface CreateSleepDto {
  userId: string;
  rate: number;
  notes?: string;
  startedAt: string;
  datetimeAt: string;
}

export type UpdateWeightDto = Partial<CreateWeightDto>;
export type UpdateHeightDto = Partial<CreateHeightDto>;
export type UpdateBloodPressureDto = Partial<CreateBloodPressureDto>;
export type UpdateSleepDto = Partial<CreateSleepDto>;

// Helper to parse dates
const parseDates = <T>(item: unknown): T => {
  const typedItem = item as T & { datetimeAt: string; startedAt?: string };
  return {
    ...typedItem,
    datetimeAt: new Date(typedItem.datetimeAt),
    startedAt: typedItem.startedAt ? new Date(typedItem.startedAt) : undefined,
  };
};

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Height
export async function fetchHeights(token: string): Promise<IHeight[]> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/heights`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to fetch heights');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<IHeight>(item));
}

export async function createHeight(dto: CreateHeightDto, token: string): Promise<IHeight> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/height`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error('Failed to create height');
  const data = await response.json();
  return parseDates<IHeight>(data);
}

export async function deleteHeight(id: string, token: string): Promise<void> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/height/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete height');
}

// Weight
export async function fetchWeights(token: string): Promise<IWeight[]> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weights`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to fetch weights');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<IWeight>(item));
}

export async function createWeight(dto: CreateWeightDto, token: string): Promise<IWeight> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weight`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error('Failed to create weight');
  const data = await response.json();
  return parseDates<IWeight>(data);
}

export async function deleteWeight(id: string, token: string): Promise<void> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weight/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete weight');
}

// Blood Pressure
export async function fetchBloodPressures(token: string): Promise<IBloodPressure[]> {
  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/blood-pressures`,
    {
      headers: getHeaders(token),
    }
  );
  if (!response.ok) throw new Error('Failed to fetch blood pressures');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<IBloodPressure>(item));
}

export async function createBloodPressure(
  dto: CreateBloodPressureDto,
  token: string
): Promise<IBloodPressure> {
  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/blood-pressure`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    }
  );
  if (!response.ok) throw new Error('Failed to create blood pressure');
  const data = await response.json();
  return parseDates<IBloodPressure>(data);
}

export async function deleteBloodPressure(id: string, token: string): Promise<void> {
  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/blood-pressure/${id}`,
    {
      method: 'DELETE',
      headers: getHeaders(token),
    }
  );
  if (!response.ok) throw new Error('Failed to delete blood pressure');
}
