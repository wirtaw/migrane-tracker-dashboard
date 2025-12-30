import { env } from '../config/env';
import { CreateLocationDto, ISummaryResponse, UpdateLocationDto } from '../models/locations.types';
import { ILocationData } from '../models/profileData.types';

const API_URL = `${env.MIGRAINE_BACKEND_API_URL}/api/v1/locations`;

export class LocationsService {
  static async getSummary(
    token: string,
    latitude: number,
    longitude: number,
    date?: string,
    incidentId?: string
  ): Promise<ISummaryResponse> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    if (date) params.append('isoDate', date);
    if (incidentId) params.append('incidentId', incidentId);

    const response = await fetch(`${API_URL}/summary?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.statusText}`);
    }

    return response.json();
  }

  static async createLocation(token: string, data: CreateLocationDto): Promise<void> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create location: ${response.statusText}`);
    }
  }

  static async getLocations(token: string): Promise<ILocationData[]> {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: { datetimeAt: string }) => ({
      ...item,
      datetimeAt: new Date(item.datetimeAt),
    })) as ILocationData[];
  }

  static async updateLocation(token: string, id: string, data: UpdateLocationDto): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update location: ${response.statusText}`);
    }
  }

  static async deleteLocation(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete location: ${response.statusText}`);
    }
  }
}
