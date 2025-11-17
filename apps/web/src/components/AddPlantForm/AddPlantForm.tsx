import {useState} from "react";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldError,
} from "@/components/ui/field.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export function AddPlantForm({onPlantAdded}: { onPlantAdded: () => void }) {
    const [commonName, setCommonName] = useState("");
    const [variety, setVariety] = useState("");
    const [cultivar, setCultivar] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        fetch("/api/plants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commonName,
                variety,
                cultivar,
                notes,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Plant Added Successfully", data);
                setCommonName("");
                setVariety("");
                setCultivar("");
                setNotes("");
                setLoading(false);
                onPlantAdded()
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    return (
        <Card className="w-full max-w-sm mb-2">
            <CardHeader>
                <CardTitle>Add a new plant</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>
                                <Label htmlFor="commonName">Common Name *</Label>
                            </FieldLabel>
                            <FieldContent>
                                <input
                                    id="commonName"
                                    type="text"
                                    value={commonName}
                                    onChange={(e) => setCommonName(e.target.value)}
                                    required
                                    className="px-3 py-2 border rounded-md"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>
                                <Label htmlFor="variety">Variety</Label>
                            </FieldLabel>
                            <FieldContent>
                                <input
                                    id="variety"
                                    type="text"
                                    value={variety}
                                    onChange={(e) => setVariety(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>
                                <Label htmlFor="cultivar">Cultivar</Label>
                            </FieldLabel>
                            <FieldContent>
                                <input
                                    id="cultivar"
                                    type="text"
                                    value={cultivar}
                                    onChange={(e) => setCultivar(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>
                                <Label htmlFor="notes">Notes</Label>
                            </FieldLabel>
                            <FieldContent>
              <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="px-3 py-2 border rounded-md"
              />
                            </FieldContent>
                        </Field>

                        {error && <FieldError>{error}</FieldError>}
                    </FieldGroup>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Add Plant"}
                    </button>
                </form>
            </CardContent>
        </Card>
    );
}
