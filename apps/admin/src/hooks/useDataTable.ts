import { useState, useCallback, useEffect } from "react";
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import { FetchParams } from "@/lib/types/api";

interface UseDataTableOptions<TData> {
  fetchData: (
    params: FetchParams
  ) => Promise<{ data: TData[]; pageCount: number }>;
  pageSize?: number;
  debounceMs?: number;
}

export function useDataTable<TData>({
  fetchData,
  pageSize = 10,
  debounceMs = 300,
}: UseDataTableOptions<TData>) {
  const [data, setData] = useState<TData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [debouncedFilter, setDebouncedFilter] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(globalFilter);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [globalFilter, debounceMs]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchData({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchTerm: debouncedFilter,
      });
      setData(result.data);
      setPageCount(result.pageCount);
    } catch (error) {
      console.error("Failed to fetch data:", error instanceof Error ? error.message : "Unknown error");
      setData([]);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sorting, debouncedFilter, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedFilter, columnFilters]);

  return {
    data,
    pageCount,
    isLoading,
    tableState: {
      pagination,
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    tableHandlers: {
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
    },
    refetch: loadData,
  };
}
