export interface PlantSummary {
  id: number;
  commonName: string;
  variety?: string;
  cultivar?: string;
  notes?: string;
  lastWateredOn?: string;
}

export interface PlantDetail extends PlantSummary{
  seededDate?: string,
  sproutedDate?: string,
  transplantedDate?: string,
  firstFlowerDate?: string,
  firstFruitDate?: string,
  lastPrunedDate?: string,
  lastFertilizedDate?: string,
  lastHarvestedDate?: string,
}
