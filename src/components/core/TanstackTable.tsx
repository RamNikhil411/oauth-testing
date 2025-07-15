import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface TanStackTableProps {
  data: any[];
  columns: any[];
  pageIndex: number;
  pageSize: number;
  pageCount?: number;
  totalCount?: number;
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  loading?: boolean;
}

export default function TanStackTable({
  data,
  columns,
  pageIndex,
  pageSize,
  pageCount,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: TanStackTableProps) {
  const [gotoPage, setGotoPage] = useState("");

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      onPageChange(newState.pageIndex);
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-md border flex flex-col h-[500px]">
      {/* Scrollable Table */}
      <div className="overflow-auto flex-1">
        <table className="min-w-full table-fixed border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {/* S.No header */}
                <th className="px-4 py-2 text-left text-sm font-medium border-b border-muted sticky top-0 bg-white z-10">
                  S.No
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium border-b border-muted sticky top-0 bg-white z-10"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-sm"
                >
                  🔄 Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-sm"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {/* S.No cell */}
                  <td className="px-4 py-2 text-sm border-b border-muted whitespace-nowrap">
                    {pageIndex * pageSize + row.index + 1}
                  </td>

                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-sm border-b border-muted whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="border-t px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Pagination buttons */}
        <Pagination className="w-fit mx-0">
          <PaginationContent>
            <PaginationItem>
              {pageIndex === 0 ? (
                <span className="text-muted-foreground opacity-50 px-3 py-2">
                  Previous
                </span>
              ) : (
                <PaginationPrevious
                  onClick={() => onPageChange(pageIndex - 1)}
                />
              )}
            </PaginationItem>
            <PaginationItem>
              {pageCount !== undefined && pageIndex + 1 >= pageCount ? (
                <span className="text-muted-foreground opacity-50 px-3 py-2">
                  Next
                </span>
              ) : (
                <PaginationNext onClick={() => onPageChange(pageIndex + 1)} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Go to page */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            className="w-20"
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
            placeholder="Go to"
            min={1}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const page = parseInt(gotoPage, 10) - 1;
              if (
                !isNaN(page) &&
                page >= 0 &&
                page < (pageCount ?? Infinity)
              ) {
                onPageChange(page);
              }
            }}
          >
            Go
          </Button>
        </div>

        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              setGotoPage("");
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Total Count Info */}
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {data.length === 0 ? 0 : pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} results
        </div>
      </div>
    </div>
  );
}
