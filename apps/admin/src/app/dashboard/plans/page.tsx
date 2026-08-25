"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { Plan } from "@/lib/types/plan";
import {
    getPlansAction,
    createPlanAction,
    updatePlanAction,
    deletePlanAction,
} from "@/lib/actions/plan";
import { planSchema } from "@/lib/schemas/finance";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

const columns: ColumnDef<Plan>[] = [
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
        accessorKey: "price",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Preço" />,
    },
    {
        accessorKey: "period",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Período" />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    },
];

const AdditionalFormFields: React.FC<{ entity?: Plan | null }> = ({ entity }) => {
    const { control, register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register("name")} defaultValue={entity?.name ?? ""} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" {...register("badge")} defaultValue={entity?.badge ?? ""} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input id="price" {...register("price")} defaultValue={entity?.price ?? ""} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Controller
                    name="period"
                    control={control}
                    defaultValue={entity?.period ?? "Mensal"}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <SelectTrigger id="period">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mensal">Mensal</SelectItem>
                                <SelectItem value="Anual">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...register("description")} defaultValue={entity?.description ?? ""} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="features">Features (uma por linha)</Label>
                <Controller
                    name="features"
                    control={control}
                    defaultValue={entity?.features ?? []}
                    render={({ field }) => (
                        <Textarea
                            id="features"
                            value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                            onChange={(e) => field.onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="display_order">Ordem</Label>
                    <Input id="display_order" type="number" {...register("display_order", { valueAsNumber: true })} defaultValue={entity?.display_order ?? 0} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" {...register("status")} defaultValue={entity?.status ?? "active"} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="trial_days">Dias de Trial</Label>
                    <Input id="trial_days" type="number" {...register("trial_days", { valueAsNumber: true })} defaultValue={entity?.trial_days ?? 0} />
                </div>

                <div className="flex items-center gap-2">
                    <Controller
                        control={control}
                        name="newsletter"
                        defaultValue={entity?.newsletter ?? false}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} id="newsletter" />
                                <Label htmlFor="newsletter">Newsletter</Label>
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="limits.users">Limite de usuários</Label>
                    <Controller
                        name="limits.users"
                        control={control}
                        defaultValue={entity?.limits?.users ?? 0}
                        render={({ field }) => <Input id="limits.users" type="number" value={String(field.value)} onChange={(e) => field.onChange(Number(e.target.value))} />}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="limits.posts">Limite de posts</Label>
                    <Controller
                        name="limits.posts"
                        control={control}
                        defaultValue={entity?.limits?.posts ?? 0}
                        render={({ field }) => <Input id="limits.posts" type="number" value={String(field.value)} onChange={(e) => field.onChange(Number(e.target.value))} />}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="limits.recipes">Limite de receitas</Label>
                    <Controller
                        name="limits.recipes"
                        control={control}
                        defaultValue={entity?.limits?.recipes ?? 0}
                        render={({ field }) => <Input id="limits.recipes" type="number" value={String(field.value)} onChange={(e) => field.onChange(Number(e.target.value))} />}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="limits.banners">Limite de banners</Label>
                    <Controller
                        name="limits.banners"
                        control={control}
                        defaultValue={entity?.limits?.banners ?? 0}
                        render={({ field }) => <Input id="limits.banners" type="number" value={String(field.value)} onChange={(e) => field.onChange(Number(e.target.value))} />}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="limits.email_campaigns">Limite de email campaigns</Label>
                <Controller
                    name="limits.email_campaigns"
                    control={control}
                    defaultValue={entity?.limits?.email_campaigns ?? 0}
                    render={({ field }) => <Input id="limits.email_campaigns" type="number" value={String(field.value)} onChange={(e) => field.onChange(Number(e.target.value))} />}
                />
            </div>
        </div>
    );
};

export default function PlansPage() {
    return (
        <CrudPage<Plan>
            title="Planos"
            description="Gerencie os planos disponíveis."
            entityName="Plano"
            actions={{
                fetch: getPlansAction,
                create: createPlanAction,
                update: updatePlanAction,
                delete: deletePlanAction,
            }}
            schema={planSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={(entity) => <AdditionalFormFields entity={entity} />}
        />
    );
}
