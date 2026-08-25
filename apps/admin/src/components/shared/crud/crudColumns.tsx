"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface BaseEntity {
    id: number;
}

interface ActionCellProps<T extends BaseEntity> {
    entity: T;
    entityName: string;
    onEdit: (entity: T) => void;
    onDelete: (entity: T) => void;
    isDeleting: boolean;
    isAdmin?: boolean;
}

export function ActionCell<T extends BaseEntity>({
    entity,
    entityName,
    onEdit,
    onDelete,
    isDeleting,
    isAdmin = true,
}: ActionCellProps<T>) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        setShowDeleteDialog(false);
        onDelete(entity);
    };

    return (
        <>
            {isAdmin && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
                        <span className="sr-only">Abrir menu</span>
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreHorizontal className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(entity)}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir {entityName.toLowerCase()} #{entity.id}?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

interface GetColumnsOptions<T extends BaseEntity> {
    entityName: string;
    onEdit: (entity: T) => void;
    onDelete: (entity: T) => void;
    isDeletingId: number | null;
    additionalColumns?: ColumnDef<T>[];
    isAdmin?: boolean;
}

export function getBaseColumns<T extends BaseEntity>({
    entityName,
    onEdit,
    onDelete,
    isDeletingId,
    additionalColumns = [],
    isAdmin = true,
}: GetColumnsOptions<T>): ColumnDef<T>[] {
    return [
        ...additionalColumns,
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <div className="text-right">
                    <ActionCell
                        entity={row.original}
                        entityName={entityName}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDeleting={isDeletingId === row.original.id}
                        isAdmin={isAdmin}
                    />
                </div>
            ),
        },
    ];
}