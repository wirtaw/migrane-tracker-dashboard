import { env } from '../config/env';
import { IUserStatistics } from '../models/user-stats.types';
import { handleResponseError } from './api-utils';

export enum Role {
  USER = 'user',
  COACH = 'coach',
  ADMIN = 'admin',
  GUEST = 'guest',
}

export interface UserPayload {
  userId: string;
  email?: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  user: UserPayload;
  token: string;
}

export interface UserProfile {
  userId: string;
  email?: string;
  longitude?: string;
  latitude?: string;
  birthDate?: string;
  emailNotifications?: boolean;
  dailySummary?: boolean;
  personalHealthData?: boolean;
  securitySetup?: boolean;
  salt?: string;
  key?: string;
  isSecurityFinished?: boolean;
  role: Role;
}

export interface UpdateProfile {
  longitude?: string;
  latitude?: string;
  birthdate?: string;
  emailNotifications?: boolean;
}

export const syncUserWithBackend = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/auth/oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response, 'Backend sync failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing user with backend:', error);
    throw error;
  }
};

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response, 'Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateProfile = async (
  token: string,
  profile: UpdateProfile
): Promise<UserProfile> => {
  try {
    const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      await handleResponseError(response, 'Failed to update user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const fetchUserStatistics = async (token: string): Promise<IUserStatistics> => {
  try {
    const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/users/me/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response, 'Failed to fetch user statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};
