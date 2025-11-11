import { type FastifyInstance } from "fastify";
import { z } from "zod";
import db from "../db.js";
import { PlantSummary } from "@rootnote/types";
import { da } from "zod/locales";

const createPlantSchema = z.object({
  commonName: z.string().min(1),
  variety: z.string().optional(),
  cultivar: z.string().optional(),
  notes: z.string().optional(),
  lastWateredOn: z.string().optional(),
});

const updatePlantSchema = z.object({
  commonName: z.string().min(1).optional(),
  variety: z.string().optional(),
  cultivar: z.string().optional(),
  notes: z.string().optional(),
  lastWateredOn: z.string().optional(),
});

export async function registerPlantRoutes(app: FastifyInstance): Promise<void> {
  app.get("/plants", async () => {
    const getPlantsQuery = db.prepare<[], PlantSummary>("SELECT * FROM plants");
    const GetPlants: PlantSummary[] = getPlantsQuery.all();

    return GetPlants;
  });

  app.post("/plants", async (request, response) => {
    const data = request.body;
    let validateData: z.infer<typeof createPlantSchema>;
    try {
      validateData = createPlantSchema.parse(data);
    } catch (error) {
      return response.status(400).send(error);
    }

    const createPlantQuery = db.prepare(
      "INSERT INTO plants (commonName, variety, cultivar, notes, lastWateredOn) VALUES (?, ?, ?, ?, ?)"
    );

    const createPlant = createPlantQuery.run(
      validateData.commonName,
      validateData.variety,
      validateData.cultivar,
      validateData.notes,
      validateData.lastWateredOn
    );

    const getPlantById = db.prepare("SELECT * FROM plants WHERE id = ?");
    const plant = getPlantById.get(createPlant["lastInsertRowid"]);

    return response.status(200).send(plant);
  });

  app.patch<{
    Params: { id: string };
    Body: z.infer<typeof updatePlantSchema>;
  }>("/plants/:id", async (request, response) => {
    const { id } = request.params;
    const data = request.body;
    let validateData: z.infer<typeof updatePlantSchema>;
    let updatePlant;
    let setClause;

    // validate schema
    try {
      validateData = updatePlantSchema.parse(data);
    } catch (error) {
      return response.status(400).send(error);
    }

    // check if request is not empty
    if (Object.keys(validateData).length == 0) {
      return response.status(400).send("No fields to update");
    }

    setClause = Object.keys(validateData)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(validateData);
    values.push(id);

    try {
      const updatePlantQuery = db.prepare(
        `UPDATE plants SET ${setClause} WHERE id = ?`
      );

      updatePlant = updatePlantQuery.run(...values);
    } catch (error) {
      return response.status(400).send(error);
    }

    return response.status(200).send(updatePlant);
  });

  app.delete<{ Params: { id: string } }>(
    "/plants/:id",
    async (request, response) => {
      const { id } = request.params;
      let deletePlant;
      try {
        const deletePlantQuery = db.prepare(`DELETE FROM plants WHERE id = ?`);
        deletePlant = deletePlantQuery.run(id);
      } catch (error) {
        return response.status(400).send(error);
      }

      return response.status(200).send(deletePlant);
    }
  );
}
