import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PlantDetail } from "@rootnote/types";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field.tsx";
import { Label } from "@radix-ui/react-label";

export function PlantDetailPage() {
  const [data, setData] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<PlantDetail | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/plants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (data && formData) {
      const hasChanges = JSON.stringify(data) !== JSON.stringify(formData);
      setIsEditing(hasChanges);
    }
  }, [data, formData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/plants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }
      const updatedPlant = await response.json();
      console.log("Updated", updatedPlant);
      setData(updatedPlant);
      setFormData(updatedPlant);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error}</p>;
  if (!data) return <p>No Data...</p>;

  console.log(formData);
  return (
    <>
      <span>Plant Details</span>
      <form onSubmit={handleSubmit}>
        {formData &&
          (Object.keys(formData) as Array<keyof PlantDetail>).map((key) => (
            <Field>
              <FieldLabel>
                <Label htmlFor="fieldId" className="text-gray-500">
                  {key}
                </Label>
              </FieldLabel>
              <FieldContent>
                <input
                  id={key}
                  type="text"
                  value={formData[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="px-3 py-2 mb-5 border rounded-md"
                />
              </FieldContent>
            </Field>
          ))}
        {isEditing && (
          <button
            type="submit"
            disabled={loading}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </form>
    </>
  );
}
