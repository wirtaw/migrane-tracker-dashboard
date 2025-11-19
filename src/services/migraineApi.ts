import { env } from '../config/env';

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
      throw new Error(`Backend sync failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing user with backend:', error);
    throw error;
  }
};

export const fetchUserProfile = async (token: string): Promise<UserPayload> => {
  try {
    const response = await fetch(`${env.MIGRAINE_BACKEND_API_URL}/api/v1/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
