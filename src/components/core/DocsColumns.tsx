// DocsColumns.ts
import type { ColumnDef } from "@tanstack/react-table";

export const DocsColumns: ColumnDef<any>[] = [

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => <div className="font-medium">{getValue() as string}</div>,
  },
  {
    accessorKey: "document_status",
    header: "Status",
    cell: ({ getValue }) => <div className="text-sm">{getValue() as string}</div>,
  },
  {
    accessorKey: "updated_at",
    header: "Last Modified",
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue() as string).toLocaleDateString() : "—",
  },
];
