import type { ColumnDef } from "@tanstack/react-table";

export type Plant = {
  commonName: string;
};

export const columns: ColumnDef<Plant>[] = [
  {
    accessorKey: "commonName",
    header: "Common Name",
  },
];
