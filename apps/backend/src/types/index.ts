export type CropStatus = 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
export type CropType = 'annual' | 'permanent';

export interface CropMilestones {
  seededDate?: string; // Format: YYYY-MM-DD
  germinationDate?: string; // Format: YYYY-MM-DD
  germinationPercentage?: number; // 0-100
  transplantedDate?: string; // Format: YYYY-MM-DD
  firstTrueLeavesDate?: string; // Format: YYYY-MM-DD
  firstFlowerDate?: string; // Format: YYYY-MM-DD
  fruitSetDate?: string; // Format: YYYY-MM-DD
  harvestDates?: string[]; // Array of YYYY-MM-DD dates
  endOfLifeDate?: string; // Format: YYYY-MM-DD
}

// For permanent crops, milestones are keyed by year
export interface VersionedMilestones {
  [year: string]: CropMilestones; // e.g., "2024": { firstFlowerDate: "2024-04-15", ... }
}

export interface Crop {
  id: string;
  name: string;
  species: string;
  plantingDate: string; // Format: MM (01-12, recurring annually)
  expectedHarvestDate: string; // Format: MM (01-12, recurring annually)
  pruneDate?: string; // Format: MM (01-12, recurring annually)
  metadata?: string;
  status: CropStatus;
  color: string;
  cropType: CropType; // 'annual' or 'permanent'
  milestones?: string; // JSON string of CropMilestones (annual) or VersionedMilestones (permanent)
  cropYear: number; // Year for crops (e.g., 2024, 2025)
  createdAt: string;
  updatedAt: string;
}

export interface CreateCropInput {
  name: string;
  species: string;
  plantingDate: string; // Format: MM (01-12, recurring annually)
  expectedHarvestDate: string; // Format: MM (01-12, recurring annually)
  pruneDate?: string; // Format: MM (01-12, recurring annually)
  metadata?: string;
  status: CropStatus;
  color: string;
  cropType: CropType;
  cropYear: number;
}

export interface UpdateCropInput {
  name?: string;
  species?: string;
  plantingDate?: string; // Format: MM (01-12, recurring annually)
  expectedHarvestDate?: string; // Format: MM (01-12, recurring annually)
  pruneDate?: string; // Format: MM (01-12, recurring annually)
  metadata?: string;
  status?: CropStatus;
  color?: string;
  cropType?: CropType;
  milestones?: string; // JSON string of CropMilestones or VersionedMilestones
  cropYear?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileInput {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Settings {
  id: string;
  userId: string;
  pushEnabled: boolean;
  reminderDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  pushEnabled?: boolean;
  reminderDays?: number;
}

export interface CropLog {
  id: string;
  cropId: string;
  logDate: string; // Format: YYYY-MM-DD
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCropLogInput {
  cropId: string;
  logDate: string; // Format: YYYY-MM-DD
  note: string;
}

export interface UpdateCropLogInput {
  logDate?: string; // Format: YYYY-MM-DD
  note?: string;
}
