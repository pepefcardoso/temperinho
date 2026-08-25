"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { PaymentMethod } from "@/lib/types/paymentMethod";
import {
    getPaymentMethodsAction,
    createPaymentMethodAction,
    updatePaymentMethodAction,
    deletePaymentMethodAction,
} from "@/lib/actions/paymentMethod";
import { paymentMethodSchema } from "@/lib/schemas/finance";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useFormContext } from "react-hook-form";

const columns: ColumnDef<PaymentMethod>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "slug",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ativo" />,
        cell: ({ row }) => (row.getValue("is_active") ? "Sim" : "Não"),
    },
];

const AdditionalFormFields: React.FC<{ entity?: PaymentMethod | null }> = ({ entity }) => {
    const { control, register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register("name")} defaultValue={entity?.name ?? ""} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} defaultValue={entity?.slug ?? ""} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" {...register("description")} defaultValue={entity?.description ?? ""} />
            </div>

            <div className="flex items-center gap-2">
                <Controller
                    control={control}
                    name="is_active"
                    defaultValue={entity?.is_active ?? true}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} id="is_active" />
                            <Label htmlFor="is_active">Ativo</Label>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default function PaymentMethodsPage() {
    return (
        <CrudPage<PaymentMethod>
            title="Métodos de Pagamento"
            description="Gerencie os métodos de pagamento disponíveis."
            entityName="Método de Pagamento"
            actions={{
                fetch: getPaymentMethodsAction,
                create: createPaymentMethodAction,
                update: updatePaymentMethodAction,
                delete: deletePaymentMethodAction,
            }}
            schema={paymentMethodSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={(entity) => <AdditionalFormFields entity={entity} />}
        />
    );
}
