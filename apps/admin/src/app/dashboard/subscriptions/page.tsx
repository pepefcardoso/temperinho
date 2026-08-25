"use client";

import { useEffect, useState } from "react";
import { CrudPage } from "@/components/shared/crud/crudPage";
import { Subscription } from "@/lib/types/subscription";
import { Plan } from "@/lib/types/plan";
import {
    getSubscriptionsAction,
    createSubscriptionAction,
    updateSubscriptionAction,
    deleteSubscriptionAction,
} from "@/lib/actions/subscription";
import { getPlansAction } from "@/lib/actions/plan";
import { subscriptionSchema } from "@/lib/schemas/finance";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";

const columns: ColumnDef<Subscription>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
        accessorKey: "company_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Empresa (ID)" />,
    },
    {
        accessorKey: "plan_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Plano" />,
        cell: ({ row }) => `Plano #${row.getValue("plan_id")}`,
    },
    {
        accessorKey: "starts_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Início" />,
    },
    {
        accessorKey: "ends_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fim" />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    },
];

function extractArrayFromPaginated<T>(resp: unknown): T[] {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp as T[];
    if (typeof resp === "object" && resp !== null) {
        const obj = resp as Record<string, unknown>;
        const candidates = ["data", "items", "results", "rows"];
        for (const key of candidates) {
            const value = obj[key];
            if (Array.isArray(value)) return value as T[];
        }
    }
    return [];
}

const AdditionalFormFields: React.FC<{ entity?: Subscription | null }> = ({ entity }) => {
    const { control, register } = useFormContext();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchPlans() {
            try {
                setIsLoading(true);
                const params = { pageIndex: 0, pageSize: 1000, sorting: [], searchTerm: "" };
                const plansResp = await getPlansAction(params);
                if (!mounted) return;
                setPlans(extractArrayFromPaginated<Plan>(plansResp));
            } catch (error) {
                console.error("Erro ao carregar planos", error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        }
        fetchPlans();
        return () => {
            mounted = false;
        };
    }, []);

    const getFormDate = (dateString?: string | null) => (dateString ? dateString.split("T")[0] : "");

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="company_id">Empresa (ID)</Label>
                <Input id="company_id" {...register("company_id", { valueAsNumber: true })} defaultValue={entity?.company_id ?? ""} required type="number" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="plan_id">Plano</Label>
                <Controller
                    control={control}
                    name="plan_id"
                    defaultValue={entity?.plan_id ?? undefined}
                    render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : undefined)} defaultValue={field.value ? String(field.value) : undefined} disabled={isLoading}>
                            <SelectTrigger id="plan_id">
                                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um plano"} />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name} — {p.price} ({p.period})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="starts_at">Início</Label>
                <Input id="starts_at" {...register("starts_at")} type="date" defaultValue={getFormDate(entity?.starts_at)} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="ends_at">Fim</Label>
                <Input id="ends_at" {...register("ends_at")} type="date" defaultValue={getFormDate(entity?.ends_at)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" {...register("status")} defaultValue={entity?.status ?? ""} required />
            </div>
        </div>
    );
};

export default function SubscriptionsPage() {
    return (
        <CrudPage<Subscription>
            title="Assinaturas"
            description="Gerencie as assinaturas."
            entityName="Assinatura"
            actions={{
                fetch: getSubscriptionsAction,
                create: createSubscriptionAction,
                update: updateSubscriptionAction,
                delete: deleteSubscriptionAction,
            }}
            schema={subscriptionSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={(entity) => <AdditionalFormFields entity={entity} />}
        />
    );
}
