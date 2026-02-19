import { env } from '../config/env';
import { IWeight, IHeight, IBloodPressure, ISleep, IWater } from '../models/profileData.types';
import { handleResponseError } from './api-utils';

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
  rate?: number;
  minutesTotal?: number;
  minutesDeep?: number;
  minutesRem?: number;
  timesWakeUp?: number;
  notes?: string;
  startedAt?: string;
  datetimeAt: string;
}

export interface CreateWaterDto {
  userId: string;
  ml: number;
  notes?: string;
  datetimeAt: string;
}

export type UpdateWeightDto = Partial<CreateWeightDto>;
export type UpdateHeightDto = Partial<CreateHeightDto>;
export type UpdateBloodPressureDto = Partial<CreateBloodPressureDto>;
export type UpdateSleepDto = Partial<CreateSleepDto>;
export type UpdateWaterDto = Partial<CreateWaterDto>;

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
  if (!response.ok) await handleResponseError(response, 'Failed to fetch heights');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<IHeight>(item));
}

export async function createHeight(dto: CreateHeightDto, token: string): Promise<IHeight> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/height`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to create height');
  const data = await response.json();
  return parseDates<IHeight>(data);
}

export async function deleteHeight(id: string, token: string): Promise<void> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/height/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to delete height');
}

export async function updateHeight(
  id: string,
  dto: UpdateHeightDto,
  token: string
): Promise<IHeight> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/height/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to update height');
  const data = await response.json();
  return parseDates<IHeight>(data);
}

// Weight
export async function fetchWeights(token: string): Promise<IWeight[]> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weights`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch weights');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<IWeight>(item));
}

export async function createWeight(dto: CreateWeightDto, token: string): Promise<IWeight> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weight`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to create weight');
  const data = await response.json();
  return parseDates<IWeight>(data);
}

export async function deleteWeight(id: string, token: string): Promise<void> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weight/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to delete weight');
}

export async function updateWeight(
  id: string,
  dto: UpdateWeightDto,
  token: string
): Promise<IWeight> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/weight/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to update weight');
  const data = await response.json();
  return parseDates<IWeight>(data);
}

// Blood Pressure
export async function fetchBloodPressures(token: string): Promise<IBloodPressure[]> {
  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/blood-pressures`,
    {
      headers: getHeaders(token),
    }
  );
  if (!response.ok) await handleResponseError(response, 'Failed to fetch blood pressures');
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
  if (!response.ok) await handleResponseError(response, 'Failed to create blood pressure');
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
  if (!response.ok) await handleResponseError(response, 'Failed to delete blood pressure');
}

export async function updateBloodPressure(
  id: string,
  dto: UpdateBloodPressureDto,
  token: string
): Promise<IBloodPressure> {
  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/blood-pressure/${id}`,
    {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    }
  );
  if (!response.ok) await handleResponseError(response, 'Failed to update blood pressure');
  const data = await response.json();
  return parseDates<IBloodPressure>(data);
}

// Sleep
export async function fetchSleeps(token: string): Promise<ISleep[]> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/sleeps`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch sleeps');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<ISleep>(item));
}

export async function createSleep(dto: CreateSleepDto, token: string): Promise<ISleep> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/sleep`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to create sleep');
  const data = await response.json();
  return parseDates<ISleep>(data);
}

export async function deleteSleep(id: string, token: string): Promise<void> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/sleep/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to delete sleep');
}

export async function updateSleep(id: string, dto: UpdateSleepDto, token: string): Promise<ISleep> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/sleep/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to update sleep');
  const data = await response.json();
  return parseDates<ISleep>(data);
}

// Water
export async function fetchWaters(token: string): Promise<IWater[]> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/waters`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch water logs');
  const data = await response.json();
  return data.map((item: unknown) => parseDates<IWater>(item));
}

export async function createWater(dto: CreateWaterDto, token: string): Promise<IWater> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/water`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to create water log');
  const data = await response.json();
  return parseDates<IWater>(data);
}

export async function deleteWater(id: string, token: string): Promise<void> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/water/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to delete water log');
}

export async function updateWater(id: string, dto: UpdateWaterDto, token: string): Promise<IWater> {
  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/health-logs/water/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to update water log');
  const data = await response.json();
  return parseDates<IWater>(data);
}
