import { type FastifyInstance } from "fastify";
import { z } from "zod";
import type { PlantSummary } from "@rootnote/types";

const samplePlants: PlantSummary[] = [
  { id: 1, commonName: "Sweet Basil" },
  { id: 2, commonName: "Red Pepper" },
];
