"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTable, DataTableColumnHeader } from "@/components/shared/dataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDataTable } from "@/hooks/useDataTable";
import { getPostsAction, approvePostAction, rejectPostAction } from "@/lib/actions/posts";
import { Post } from "@/lib/types/post";

const statusVariant: Record<Post["status"], "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  published: "default",
  rejected: "destructive",
};

const statusLabel: Record<Post["status"], string> = {
  pending: "Pendente",
  published: "Publicado",
  rejected: "Rejeitado",
};

export default function PostsPage() {
  const { data, pageCount, isLoading, tableState, tableHandlers, refetch } =
    useDataTable<Post>({
      fetchData: async (params) => {
        const result = await getPostsAction(params);
        return {
          data: result.data,
          pageCount: result.meta.last_page,
        };
      },
      pageSize: 10,
    });

  const [rejectTarget, setRejectTarget] = useState<Post | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (post: Post) => {
    const result = await approvePostAction(post.id);
    if (result.success) {
      toast.success(result.message);
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setIsSubmitting(true);
    const result = await rejectPostAction(rejectTarget.id, rejectReason);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      setRejectTarget(null);
      setRejectReason("");
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "company_id",
      header: "Tipo",
      cell: ({ row }) => (row.original.company_id ? <Badge variant="outline">Patrocinado</Badge> : "Equipe interna"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Post["status"];
        return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Criado em" />,
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const post = row.original;
        if (post.status !== "pending") return null;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleApprove(post)}>
              <CheckCircle className="mr-1 h-4 w-4" /> Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => setRejectTarget(post)}
            >
              <XCircle className="mr-1 h-4 w-4" /> Rejeitar
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Toaster richColors position="top-right" />
      <EntityPage
        title="Artigos"
        description="Revise e aprove artigos enviados por patrocinadores."
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

      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar artigo</DialogTitle>
            <DialogDescription>
              Explique o motivo — o patrocinador receberá isso por e-mail.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: imagem em baixa resolução, conteúdo precisa de mais detalhes..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancelar</Button>
            <Button variant="destructive" disabled={!rejectReason.trim() || isSubmitting} onClick={handleReject}>
              Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
