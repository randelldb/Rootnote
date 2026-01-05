import { Crop, UserProfile, NotificationSettings, CropLog, CreateCropLogInput } from '../types';

// Use relative URL to leverage Vite proxy in development
// In production, set VITE_API_URL to your backend URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface CreateCropInput {
  name: string;
  species: string;
  plantingDate: string;
  expectedHarvestDate: string;
  pruneDate?: string;
  metadata?: string;
  status: 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
  color: string;
  cropType: 'annual' | 'permanent';
  cropYear: number;
}

export interface UpdateCropInput {
  name?: string;
  species?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  pruneDate?: string;
  metadata?: string;
  status?: 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
  color?: string;
  cropType?: 'annual' | 'permanent';
  milestones?: string;
  cropYear?: number;
}

export const cropService = {
  async getAll(): Promise<Crop[]> {
    const response = await fetch(`${API_URL}/crops`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch crops');
    const data = await response.json();
    return data.data;
  },

  async getById(id: string): Promise<Crop> {
    const response = await fetch(`${API_URL}/crops/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch crop');
    const data = await response.json();
    return data.data;
  },

  async create(crop: CreateCropInput): Promise<Crop> {
    const response = await fetch(`${API_URL}/crops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(crop),
    });
    if (!response.ok) throw new Error('Failed to create crop');
    const data = await response.json();
    return data.data;
  },

  async update(id: string, updates: UpdateCropInput): Promise<Crop> {
    const response = await fetch(`${API_URL}/crops/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update crop');
    const data = await response.json();
    return data.data;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/crops/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete crop');
  },
};

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  avatar?: string;
}

export const profileService = {
  async get(): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    const data = await response.json();
    return data.data;
  },

  async update(updates: UpdateProfileInput): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    const data = await response.json();
    return data.data;
  },
};

export interface UpdateSettingsInput {
  pushEnabled?: boolean;
  reminderDays?: number;
}

export const settingsService = {
  async get(): Promise<NotificationSettings> {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    const data = await response.json();
    return data.data;
  },

  async update(updates: UpdateSettingsInput): Promise<NotificationSettings> {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    const data = await response.json();
    return data.data;
  },
};

export interface UpdateCropLogInput {
  logDate?: string;
  note?: string;
}

export const cropLogService = {
  async getByCropId(cropId: string): Promise<CropLog[]> {
    const response = await fetch(`${API_URL}/crops/${cropId}/logs`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch crop logs');
    return response.json();
  },

  async getById(id: string): Promise<CropLog> {
    const response = await fetch(`${API_URL}/crop-logs/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch crop log');
    return response.json();
  },

  async create(log: CreateCropLogInput): Promise<CropLog> {
    const response = await fetch(`${API_URL}/crop-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('Failed to create crop log');
    return response.json();
  },

  async update(id: string, updates: UpdateCropLogInput): Promise<CropLog> {
    const response = await fetch(`${API_URL}/crop-logs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update crop log');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/crop-logs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete crop log');
  },
};
