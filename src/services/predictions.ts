import { env } from '../config/env';
import {
  PredictionRule,
  CreatePredictionRulePayload,
  UpdatePredictionRulePayload,
  RiskForecastQuery,
  RiskForecastResponse,
  NotificationResponse,
} from '../models/predictions.types';
import { handleResponseError } from './api-utils';

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export async function fetchPredictionRules(token: string): Promise<PredictionRule[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch prediction rules failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/rules`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch prediction rules');
  return response.json();
}

export async function createPredictionRule(
  payload: CreatePredictionRulePayload,
  token: string
): Promise<PredictionRule> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Create prediction rule failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/rules`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to create prediction rule');
  return response.json();
}

export async function updatePredictionRule(
  id: string,
  payload: UpdatePredictionRulePayload,
  token: string
): Promise<PredictionRule> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Update prediction rule failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/rules/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to update prediction rule');
  return response.json();
}

export async function deletePredictionRule(id: string, token: string): Promise<void> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Delete prediction rule failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/rules/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to delete prediction rule');
}

export async function fetchRiskForecast(
  token: string,
  query?: RiskForecastQuery
): Promise<RiskForecastResponse> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch risk forecast failed: Missing configuration or token');
  }

  const url = new URL(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/risk-forecast`);
  if (query) {
    if (query.latitude !== undefined) url.searchParams.append('latitude', String(query.latitude));
    if (query.longitude !== undefined)
      url.searchParams.append('longitude', String(query.longitude));
    if (query.weights) {
      if (query.weights.weather !== undefined)
        url.searchParams.append('weights[weather]', String(query.weights.weather));
      if (query.weights.solar !== undefined)
        url.searchParams.append('weights[solar]', String(query.weights.solar));
      if (query.weights.history !== undefined)
        url.searchParams.append('weights[history]', String(query.weights.history));
    }
  }

  const response = await fetch(url.toString(), {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch risk forecast');
  return response.json();
}

export async function fetchNotifications(token: string): Promise<NotificationResponse[]> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Fetch notifications failed: Missing configuration or token');
  }

  const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/notifications`, {
    headers: getHeaders(token),
  });
  if (!response.ok) await handleResponseError(response, 'Failed to fetch notifications');
  return response.json();
}

export async function markNotificationAsRead(id: string, token: string): Promise<void> {
  if (!env.MIGRAINE_BACKEND_API_URL || !token) {
    throw new Error('Mark notification read failed: Missing configuration or token');
  }

  const response = await fetch(
    `${env.MIGRAINE_BACKEND_API_URL}/api/v1/predictions/notifications/${id}/read`,
    {
      method: 'PATCH',
      headers: getHeaders(token),
    }
  );
  if (!response.ok) await handleResponseError(response, 'Failed to mark notification as read');
}
