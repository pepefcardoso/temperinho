"use client";

import { useState, useEffect } from "react";
import { CrudPage } from "@/components/shared/crud/crudPage";
import { Payment } from "@/lib/types/payment";
import { Subscription } from "@/lib/types/subscription";
import { PaymentMethod } from "@/lib/types/paymentMethod";
import {
    getPaymentsAction,
    createPaymentAction,
    updatePaymentAction,
    deletePaymentAction,
} from "@/lib/actions/payment";
import { getSubscriptionsAction } from "@/lib/actions/subscription";
import { getPaymentMethodsAction } from "@/lib/actions/paymentMethod";
import { paymentSchema } from "@/lib/schemas/finance";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
};

const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Valor" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
    },
    {
        accessorKey: "subscription",
        header: "Assinatura",
        cell: ({ row }) => {
            const subscription = row.original.subscription;
            return subscription ? `Assinatura #${subscription.id}` : "-";
        },
    },
    {
        accessorKey: "payment_method",
        header: "Método",
        cell: ({ row }) => {
            const paymentMethod = row.original.payment_method;
            return paymentMethod ? paymentMethod.name : "-";
        },
    },
    {
        accessorKey: "due_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Vencimento" />
        ),
        cell: ({ row }) => formatDate(row.getValue("due_date")),
    },
    {
        accessorKey: "paid_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pago em" />
        ),
        cell: ({ row }) => formatDate(row.getValue("paid_at")),
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

const getFormDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
};

const AdditionalFormFields: React.FC<{ entity?: Payment | null }> = ({ entity }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { control } = useFormContext();

    useEffect(() => {
        let mounted = true;
        const params = {
            pageIndex: 0,
            pageSize: 1000,
            sorting: [],
            searchTerm: "",
        };

        async function fetchData() {
            try {
                setIsLoading(true);
                const [subsResp, methodsResp] = await Promise.all([
                    getSubscriptionsAction(params),
                    getPaymentMethodsAction(params),
                ]);
                if (!mounted) return;
                setSubscriptions(extractArrayFromPaginated<Subscription>(subsResp));
                setPaymentMethods(extractArrayFromPaginated<PaymentMethod>(methodsResp));
            } catch (error) {
                console.error("Falha ao buscar dados para o formulário", error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input id="amount" name="amount" type="number" step="0.01" defaultValue={entity?.amount ?? ""} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" name="status" defaultValue={entity?.status ?? ""} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="subscription_id">Assinatura</Label>
                <Controller
                    name="subscription_id"
                    control={control}
                    defaultValue={entity?.subscription?.id ?? undefined}
                    render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : undefined)} defaultValue={field.value ? String(field.value) : undefined} disabled={isLoading}>
                            <SelectTrigger id="subscription_id">
                                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione uma assinatura"} />
                            </SelectTrigger>
                            <SelectContent>
                                {subscriptions.map((sub) => (
                                    <SelectItem key={sub.id} value={sub.id.toString()}>
                                        Assinatura #{sub.id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="payment_method_id">Método de Pagamento</Label>
                <Controller
                    name="payment_method_id"
                    control={control}
                    defaultValue={entity?.payment_method?.id ?? undefined}
                    render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : undefined)} defaultValue={field.value ? String(field.value) : undefined} disabled={isLoading}>
                            <SelectTrigger id="payment_method_id">
                                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um método"} />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((method) => (
                                    <SelectItem key={method.id} value={method.id.toString()}>
                                        {method.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">Data de Vencimento</Label>
                <Input id="due_date" name="due_date" type="date" defaultValue={getFormDate(entity?.due_date)} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="paid_at">Data de Pagamento</Label>
                <Input id="paid_at" name="paid_at" type="date" defaultValue={getFormDate(entity?.paid_at)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input id="notes" name="notes" defaultValue={entity?.notes ?? ""} />
            </div>
        </div>
    );
};

export default function PaymentsPage() {
    return (
        <CrudPage<Payment>
            title="Pagamentos"
            description="Gerencie os pagamentos cadastrados."
            entityName="Pagamento"
            actions={{
                fetch: getPaymentsAction,
                create: createPaymentAction,
                update: updatePaymentAction,
                delete: deletePaymentAction,
            }}
            schema={paymentSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={(entity) => <AdditionalFormFields entity={entity} />}
        />
    );
}
