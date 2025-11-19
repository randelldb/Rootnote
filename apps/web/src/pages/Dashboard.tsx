import { PlantList } from "../components/PlantList/PlantList.tsx";
import { AddPlantForm } from "../components/AddPlantForm/AddPlantForm.tsx";
import { useEffect, useState } from "react";
import type { PlantSummary } from "@rootnote/types";

export function Dashboard() {
  const [plants, setPlants] = useState<PlantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/plants")
      .then((response) => response.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const refetchPlants = () => {
    setLoading(true);
    setError("");

    fetch("/api/plants")
      .then((response) => response.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-bold">Dashboard</div>
      <AddPlantForm onPlantAdded={refetchPlants} />
      <PlantList plants={plants} loading={loading} error={error} />
    </div>
  );
}
