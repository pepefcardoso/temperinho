"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { CustomerContact } from "@/lib/types/customer";
import {
    getCustomerContactsAction,
    updateCustomerContactAction,
} from "@/lib/actions/customerContact";
import { customerContactSchema } from "@/lib/schemas/customers";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { maskEmail, maskPhone } from "@/lib/utils/masking";
import { useUserStore } from "@/stores/userStore";
import { useMemo } from "react";

const getColumns = (isAdmin: boolean): ColumnDef<CustomerContact>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="E-mail" />,
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            return isAdmin ? email : maskEmail(email);
        },
    },
    {
        accessorKey: "phone",
        header: "Telefone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            if (!phone) return "-";
            return isAdmin ? phone : maskPhone(phone);
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Enviado em" />,
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR"),
    },
    {
        accessorKey: "consent_date",
        header: "Data Consentimento",
        cell: ({ row }) => {
            const date = row.getValue("consent_date");
            return date ? new Date(date as string).toLocaleDateString("pt-BR") : "-";
        },
    },
    {
        accessorKey: "consent_source",
        header: "Origem Consentimento",
        cell: ({ row }) => row.getValue("consent_source") || "-",
    },
];

const renderAdditionalFormFields = (entity?: CustomerContact | null) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" name="status" defaultValue={entity?.status ?? "new"} required />
        </div>
    </div>
);

export default function CustomerContactsPage() {
    const user = useUserStore((state) => state.user);
    const isAdmin = user?.role === "admin";
    const columns = useMemo(() => getColumns(isAdmin), [isAdmin]);

    return (
        <CrudPage<CustomerContact>
            title="Contatos de Clientes"
            description="Gerencie os contatos recebidos através do site."
            entityName="Contato"
            actions={{
                fetch: getCustomerContactsAction,
                update: updateCustomerContactAction,
            }}
            isCreateEnabled={false}
            schema={customerContactSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={renderAdditionalFormFields}
        />
    );
}