"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTable, DataTableColumnHeader } from "@/components/shared/dataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/useDataTable";
import { getReportsAction, reviewReportAction } from "@/lib/actions/reports";
import { Report } from "@/lib/types/report";

const reasonLabel: Record<Report["reason"], string> = {
  spam: "Spam",
  inappropriate: "Conteúdo impróprio",
  misinformation: "Informação incorreta",
  other: "Outro",
};

export default function ReportsPage() {
  const { data, pageCount, isLoading, tableState, tableHandlers, refetch } =
    useDataTable<Report>({
      fetchData: async (params) => {
        const result = await getReportsAction(params);
        return {
          data: result.data,
          pageCount: result.meta.last_page,
        };
      },
      pageSize: 10,
    });

  const handleReview = async (report: Report) => {
    const result = await reviewReportAction(report.id);
    if (result.success) {
      toast.success(result.message);
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "reportable_type",
      header: "Tipo",
      cell: ({ row }) => <Badge variant="outline">{row.original.reportable_type}</Badge>,
    },
    { accessorKey: "reportable_id", header: "ID do conteúdo" },
    {
      accessorKey: "reason",
      header: "Motivo",
      cell: ({ row }) => reasonLabel[row.original.reason],
    },
    {
      accessorKey: "comment",
      header: "Comentário",
      cell: ({ row }) => row.original.comment || "-",
    },
    {
      id: "reporter",
      header: "Denunciado por",
      cell: ({ row }) => row.original.reporter?.name ?? "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "pending" ? "secondary" : "default"}>
          {row.original.status === "pending" ? "Pendente" : "Revisado"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) =>
        row.original.status === "pending" ? (
          <Button size="sm" variant="outline" onClick={() => handleReview(row.original)}>
            <CheckCircle className="mr-1 h-4 w-4" /> Marcar como revisado
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <Toaster richColors position="top-right" />
      <EntityPage
        title="Denúncias"
        description="Revise denúncias de comentários, avaliações e receitas. Para excluir o conteúdo denunciado, use as páginas de Comentários, Avaliações ou Receitas."
        isLoading={isLoading}
      >
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          state={{
            pagination: tableState.pagination,
            sorting: tableState.sorting,
            globalFilter: tableState.globalFilter,
          }}
          onPaginationChange={tableHandlers.onPaginationChange}
          onSortingChange={tableHandlers.onSortingChange}
          onGlobalFilterChange={tableHandlers.onGlobalFilterChange}
          manualPagination
          manualSorting
          manualFiltering
        />
      </EntityPage>
    </>
  );
}
