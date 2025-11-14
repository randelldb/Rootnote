import Database from "better-sqlite3";

const db = new Database("rootnote.db");

// Create the plants table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commonName TEXT NOT NULL,
    variety TEXT,
    cultivar TEXT,
    notes TEXT,
    lastWateredOn TEXT,
    seededDate TEXT,
    sproutedDate TEXT,
    transplantedDate TEXT,
    firstFlowerDate TEXT,
    firstFruitDate TEXT,
    lastPrunedDate TEXT,
    lastFertilizedDate TEXT,
    lastHarvestedDate TEXT
  )
`);

export default db;
