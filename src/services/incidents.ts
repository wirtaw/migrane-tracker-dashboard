import { env } from '../config/env';
import { IIncident } from '../models/profileData.types';
import { IncidentStats } from '../models/stats.types';
import { handleResponseError } from './api-utils';

// DTOs
export interface CreateIncidentDto {
  userId: string;
  type: string;
  startTime: string;
  durationHours: number;
  notes?: string;
  triggers?: string[];
  datetimeAt: string;
}

export type UpdateIncidentDto = Partial<CreateIncidentDto>;

const parseDates = (item: unknown): IIncident => {
  const data = item as {
    userId: string;
    type: string;
    startTime: string;
    durationHours: number;
    notes?: string;
    triggers?: string[];
    createdAt: string;
    datetimeAt: string;
    id: string;
  };
  return {
    ...data,
    triggers: data.triggers || [],
    startTime: new Date(data.startTime),
    createdAt: new Date(data.createdAt),
    datetimeAt: new Date(data.datetimeAt),
  };
};

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export async function fetchIncidents(token: string): Promise<IIncident[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch incidents failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch incidents');
  const data = await response.json();
  return data.map(parseDates);
}

export async function createIncident(dto: CreateIncidentDto, token: string): Promise<IIncident> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Create incident failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to create incident');
  const data = await response.json();
  return parseDates(data);
}

export async function deleteIncident(id: string, token: string): Promise<void> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Delete incident failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to delete incident');
}

export async function fetchIncidentStats(token: string): Promise<IncidentStats> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch stats failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents/stats`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch incident stats');
  return response.json();
}

export async function updateIncident(
  id: string,
  dto: UpdateIncidentDto,
  token: string
): Promise<IIncident> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Update incident failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(dto),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to update incident');
  const data = await response.json();
  return parseDates(data);
}

export async function fetchIncidentTypes(token: string): Promise<string[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch incident types failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents/types`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch incident types');
  return response.json();
}

export async function fetchIncidentTriggers(token: string): Promise<string[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch incident triggers failed: Missing configuration or token');
  }

  return fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/incidents/triggers`, {
    headers: getHeaders(token),
  })
    .then(response => {
      if (!response.ok) {
        return handleResponseError(response, 'Failed to fetch incident triggers');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching incident triggers:', error);
      throw error;
    });
}