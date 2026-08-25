"use client";

import { ReactNode } from "react";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTable } from "@/components/shared/dataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { Toaster } from "sonner";
import { exportToCsv } from "@/lib/utils/export";
import { useUserStore } from "@/stores/userStore";
import { EntityForm, BaseEntity } from "./entityForm";
import { getBaseColumns } from "./crudColumns";
import { useEntityCrud, EntityCrudActions } from "@/hooks/useEntityCrud";
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";

interface CrudPageProps<T extends BaseEntity> {
    title: string;
    description: string;
    entityName: string;
    actions: EntityCrudActions<T>;
    pageSize?: number;
    additionalColumns?: ColumnDef<T>[];
    renderAdditionalFormFields?: (entity?: T | null) => ReactNode;
    schema: z.Schema<unknown>;
    isCreateEnabled?: boolean;
}

export function CrudPage<T extends BaseEntity>({
    title,
    description,
    entityName,
    actions,
    pageSize = 10,
    additionalColumns = [],
    renderAdditionalFormFields,
    schema,
    isCreateEnabled = true,
}: CrudPageProps<T>) {
    const {
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
    } = useEntityCrud<T>({
        actions,
        pageSize,
        entityName,
    });

    const user = useUserStore((state) => state.user);
    const isAdmin = user?.role === "admin";

    const columns = getBaseColumns<T>({
        entityName,
        onEdit: handleEdit,
        onDelete: handleDelete,
        isDeletingId,
        additionalColumns,
        isAdmin,
    });

    return (
        <>
            <Toaster richColors position="top-right" />
            <EntityPage
                title={title}
                description={description}
                isLoading={isLoading}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => exportToCsv(data, `${entityName.toLowerCase()}s_export`)}>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar CSV
                        </Button>
                        {isCreateEnabled && isAdmin ? (
                            <Button onClick={handleNew}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nov{entityName.endsWith('a') ? 'a' : 'o'} {entityName}
                            </Button>
                        ) : null}
                    </div>
                }
            >
                <DataTable
                    columns={columns}
                    data={data}
                    pageCount={pageCount}
                    state={{
                        pagination: tableState.pagination,
                        sorting: tableState.sorting,
                        globalFilter: tableState.globalFilter,
                        rowSelection: tableState.rowSelection,
                    }}
                    onPaginationChange={tableHandlers.onPaginationChange}
                    onSortingChange={tableHandlers.onSortingChange}
                    onGlobalFilterChange={tableHandlers.onGlobalFilterChange}
                    onRowSelectionChange={tableHandlers.onRowSelectionChange}
                    manualPagination
                    manualSorting
                    manualFiltering
                />
            </EntityPage>

            <EntityForm<T>
                isOpen={isFormOpen}
                onClose={handleFormClose}
                entity={selectedEntity}
                entityName={entityName}
                createAction={actions.create}
                updateAction={actions.update}
                renderAdditionalFields={renderAdditionalFormFields}
                schema={schema}
            />
        </>
    );
}