"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ActionState } from "@/lib/types/api";

export interface BaseEntity {
    id: number;
}

interface EntityFormProps<T extends BaseEntity> {
    isOpen: boolean;
    onClose: (shouldRefetch: boolean) => void;
    entity?: T | null;
    entityName: string;
    createAction?: (
        prevState: ActionState | undefined,
        formData: FormData
    ) => Promise<ActionState>;
    updateAction: (
        id: number,
        prevState: ActionState | undefined,
        formData: FormData
    ) => Promise<ActionState>;
    renderAdditionalFields?: (entity?: T | null) => React.ReactNode;
    schema: z.Schema<unknown>;
}

export function EntityForm<T extends BaseEntity>({
    isOpen,
    onClose,
    entity,
    entityName,
    createAction,
    updateAction,
    schema,
    renderAdditionalFields,
}: EntityFormProps<T>) {
    const isEditing = !!entity;

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = useForm<import("react-hook-form").FieldValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema as any),
        defaultValues: entity || {},
    });

    useEffect(() => {
        if (isOpen) {
            reset(entity ?? {});
        }
    }, [isOpen, entity, reset]);

    const processForm = async (data: import("react-hook-form").FieldValues) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        let state: ActionState;
        if (isEditing) {
            state = await updateAction(entity.id, undefined, formData);
        } else {
            if (!createAction) {
                toast.error("Criação não permitida para esta entidade.");
                return;
            }
            state = await createAction(undefined, formData);
        }

        if (state.success) {
            toast.success(state.message || "Operação realizada com sucesso!");
            onClose(true);
        } else {
            toast.error(state.message || "Ocorreu um erro ao processar a solicitação.");
        }
    };

    const entityGenderSuffix = entityName.endsWith('a') ? 'a' : 'o';
    const entityArticle = entityName.endsWith('a') ? 'a' : 'o';
    const entityArticleUpper = entityName.endsWith('a') ? 'a' : '';


    return (
        <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Editar ${entityName}` : `Nov${entityGenderSuffix} ${entityName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? `Faça alterações n${entityArticle} ${entityName.toLowerCase()} aqui.`
                            : `Adicione um${entityArticleUpper} nov${entityGenderSuffix} ${entityName.toLowerCase()} à lista.`}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(processForm)} className="space-y-4">

                    {renderAdditionalFields && renderAdditionalFields(entity)}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting
                                ? "Salvando..."
                                : isEditing
                                    ? "Salvar Alterações"
                                    : `Criar ${entityName}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}