import {
  ColumnDef,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  noResultsMessage?: string;
  isLoading?: boolean;
  pagination?: PaginationState;
  sorting?: SortingState;
  globalFilter?: string;
  columnFilters?: ColumnFiltersState;
  columnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;

  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onGlobalFilterChange?: (filter: string) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  onRowSelectionChange?: (selection: RowSelectionState) => void;

  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
}
