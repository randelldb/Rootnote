import db from './database.js';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  console.log('Running database migrations...');

  // Ensure data directory exists
  const dataDir = join(__dirname, '../../data');
  await mkdir(dataDir, { recursive: true });

  // Create crops table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crops (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      plantingDate TEXT NOT NULL,
      expectedHarvestDate TEXT NOT NULL,
      metadata TEXT,
      status TEXT NOT NULL CHECK(status IN ('Growing', 'Seeding', 'Harvested', 'Planned')),
      color TEXT NOT NULL,
      milestones TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Add milestones column if it doesn't exist (for existing databases)
  try {
    db.exec(`ALTER TABLE crops ADD COLUMN milestones TEXT;`);
    console.log('✓ Added milestones column to crops table');
  } catch (error: any) {
    // Column already exists, which is fine
    if (!error.message.includes('duplicate column')) {
      throw error;
    }
  }

  // Add cropYear column if it doesn't exist
  try {
    db.exec(`ALTER TABLE crops ADD COLUMN cropYear INTEGER;`);
    console.log('✓ Added cropYear column to crops table');
  } catch (error: any) {
    if (!error.message.includes('duplicate column')) {
      throw error;
    }
  }

  // Add cropType column if it doesn't exist
  try {
    db.exec(
      `ALTER TABLE crops ADD COLUMN cropType TEXT DEFAULT 'annual' CHECK(cropType IN ('annual', 'permanent'));`
    );
    console.log('✓ Added cropType column to crops table');
  } catch (error: any) {
    if (!error.message.includes('duplicate column')) {
      throw error;
    }
  }

  // Add pruneDate column if it doesn't exist
  try {
    db.exec(`ALTER TABLE crops ADD COLUMN pruneDate TEXT;`);
    console.log('✓ Added pruneDate column to crops table');
  } catch (error: any) {
    if (!error.message.includes('duplicate column')) {
      throw error;
    }
  }

  // Create index on cropType for faster filtering
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_crops_cropType ON crops(cropType);
  `);

  // Create index on status
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_crops_status ON crops(status);
  `);

  // Create index on plantingDate
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_crops_plantingDate ON crops(plantingDate);
  `);

  // Create trigger to update updatedAt
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_crops_timestamp 
    AFTER UPDATE ON crops
    BEGIN
      UPDATE crops SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
  `);

  // Create user_profile table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      avatar TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create trigger for user_profile
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_user_profile_timestamp 
    AFTER UPDATE ON user_profile
    BEGIN
      UPDATE user_profile SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
  `);

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      pushEnabled INTEGER NOT NULL DEFAULT 0,
      reminderDays INTEGER NOT NULL DEFAULT 3,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES user_profile(id) ON DELETE CASCADE
    );
  `);

  // Create trigger for settings
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_settings_timestamp 
    AFTER UPDATE ON settings
    BEGIN
      UPDATE settings SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
  `);

  // Create crop_logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crop_logs (
      id TEXT PRIMARY KEY,
      cropId TEXT NOT NULL,
      logDate TEXT NOT NULL,
      note TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (cropId) REFERENCES crops(id) ON DELETE CASCADE
    );
  `);

  // Create index on cropId for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_crop_logs_cropId ON crop_logs(cropId);
  `);

  // Create index on logDate
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_crop_logs_logDate ON crop_logs(logDate);
  `);

  // Create trigger to update updatedAt for crop_logs
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_crop_logs_timestamp 
    AFTER UPDATE ON crop_logs
    BEGIN
      UPDATE crop_logs SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
  `);

  // Seed default user profile if not exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM user_profile').get() as {
    count: number;
  };
  if (userCount.count === 0) {
    const userId = 'default-user-id';
    db.prepare(
      `
      INSERT INTO user_profile (id, name, email, avatar)
      VALUES (?, ?, ?, ?)
    `
    ).run(
      userId,
      'Arthur Green',
      'arthur@rootnote.app',
      'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop'
    );

    // Create default settings for the user
    db.prepare(
      `
      INSERT INTO settings (id, userId, pushEnabled, reminderDays)
      VALUES (?, ?, ?, ?)
    `
    ).run('default-settings-id', userId, 1, 3);

    console.log('✓ Seeded default user profile and settings');
  }

  console.log('✅ Migrations completed successfully!');
  db.close();
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
