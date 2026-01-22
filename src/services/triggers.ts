import { env } from '../config/env';
import { ITrigger } from '../models/profileData.types';
import { handleResponseError } from './api-utils';

export interface CreateTriggerDto {
  userId: string;
  type: string;
  note?: string;
  datetimeAt: string;
}

export type UpdateTriggerDto = Partial<CreateTriggerDto>;

interface ApiTriggerResponse extends Omit<ITrigger, 'createdAt' | 'datetimeAt'> {
  createdAt: string;
  datetimeAt: string;
}

const parseTriggerDates = (trigger: ApiTriggerResponse): ITrigger => {
  return {
    ...trigger,
    createdAt: new Date(trigger.createdAt),
    datetimeAt: new Date(trigger.datetimeAt),
  };
};

export async function fetchTriggers(token: string): Promise<ITrigger[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Trigger fetch failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/triggers`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to fetch triggers');
  }

  const data = await response.json();
  return data.map(parseTriggerDates);
}

export async function createTrigger(dto: CreateTriggerDto, token: string): Promise<ITrigger> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Create trigger failed: Missing configuration or token');
  }

  const url = `${env.MIGRAINE_BACKEND_API_URL}/api/v1/triggers`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to create trigger');
  }

  const data = await response.json();

  return parseTriggerDates(data);
}

export async function updateTrigger(
  id: string,
  dto: UpdateTriggerDto,
  token: string
): Promise<ITrigger> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Update trigger failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/triggers/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to update trigger');
  }

  const data = await response.json();
  return parseTriggerDates(data);
}

export async function deleteTrigger(id: string, token: string): Promise<void> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Delete trigger failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/triggers/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to delete trigger');
  }
}
