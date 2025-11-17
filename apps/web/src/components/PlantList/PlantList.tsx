import type {PlantSummary} from "@rootnote/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DataTable} from "@/components/PlantList/data-table.tsx";
import {columns} from "@/components/PlantList/columns.tsx";

export function PlantList(
    {
        plants,
        error,
        loading
    }:{
        plants: PlantSummary[],
        loading: boolean,
        error: string
    }
) {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    if (plants.length === 0) return <p>No plants found.</p>;

console.log("plants found", plants);

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Your plants</CardTitle>
            </CardHeader>
            <CardContent>

                <DataTable columns={columns} data={plants} />

            </CardContent>
        </Card>
    )
}
