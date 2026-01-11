export type Tab = 'dashboard' | 'crops' | 'settings';
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
  plantingDate: string; // Format: MM (e.g., "03" for March)
  preSownDate?: string; // Format: MM (e.g., "02" for February)
  expectedHarvestDate: string; // Format: MM (e.g., "06" for June)
  pruneDate?: string; // Format: MM (e.g., "06" for June)
  metadata?: string;
  status: 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
  color: string;
  cropType: CropType; // 'annual' or 'permanent'
  milestones?: string; // JSON string of CropMilestones (annual) or VersionedMilestones (permanent)
  cropYear: number; // Year for crops (e.g., 2024, 2025)
}

export interface UpcomingEvent {
  id: string;
  cropId: string;
  cropName: string;
  type: 'Seeding' | 'Harvest';
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  reminderDays: number;
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
