import { useState, useCallback } from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { FetchParams, ActionState, PaginatedResponse } from "@/lib/types/api";
import { toast } from "sonner";

export interface BaseEntity {
  id: number;
}

export interface EntityCrudActions<T extends BaseEntity> {
  fetch: (params: FetchParams) => Promise<PaginatedResponse<T>>;
  create?: (
    prevState: ActionState | undefined,
    formData: FormData
  ) => Promise<ActionState>;
  update: (
    id: number,
    prevState: ActionState | undefined,
    formData: FormData
  ) => Promise<ActionState>;
  delete?: (id: number) => Promise<ActionState>;
}

interface UseEntityCrudOptions<T extends BaseEntity> {
  actions: EntityCrudActions<T>;
  pageSize?: number;
  entityName: string;
}

export function useEntityCrud<T extends BaseEntity>({
  actions,
  pageSize = 10,
  entityName,
}: UseEntityCrudOptions<T>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<T | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const fetchEntities = useCallback(
    async (params: FetchParams) => {
      const result = await actions.fetch(params);
      return {
        data: result.data,
        pageCount: result.meta.last_page,
      };
    },
    [actions]
  );

  const { data, pageCount, isLoading, tableState, tableHandlers, refetch } =
    useDataTable<T>({
      fetchData: fetchEntities,
      pageSize,
    });

  const handleNew = useCallback(() => {
    setSelectedEntity(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((entity: T) => {
    setSelectedEntity(entity);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (entity: T) => {
      if (!actions.delete) {
        toast.error(`A exclusão não é permitida para ${entityName.toLowerCase()}`);
        return;
      }
      setIsDeletingId(entity.id);
      try {
        const result = await actions.delete(entity.id);
        if (result.success) {
          toast.success(
            result.message || `${entityName} excluído(a) com sucesso`
          );
          refetch();
        } else {
          toast.error(
            result.message || `Erro ao excluir ${entityName.toLowerCase()}`
          );
        }
      } catch (error) {
        console.error(`Erro ao excluir ${entityName.toLowerCase()}:`, error instanceof Error ? error.message : "Unknown error");
        toast.error(`Erro ao excluir ${entityName.toLowerCase()}`);
      } finally {
        setIsDeletingId(null);
      }
    },
    [actions, entityName, refetch]
  );

  const handleFormClose = useCallback(
    (shouldRefetch: boolean) => {
      setIsFormOpen(false);
      if (shouldRefetch) {
        refetch();
      }
    },
    [refetch]
  );

  return {
    data,
    pageCount,
    isLoading,
    isFormOpen,
    selectedEntity,
    isDeletingId,
    tableState,
    tableHandlers,
    handleNew,
    handleEdit,
    handleDelete,
    handleFormClose,
    refetch,
  };
}
