"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { NewsletterCustomer } from "@/lib/types/customer";
import {
    getNewsletterCustomersAction,
    createNewsletterCustomerAction,
    updateNewsletterCustomerAction,
    deleteNewsletterCustomerAction,
} from "@/lib/actions/newsletterCustomer";
import { newsletterCustomerSchema } from "@/lib/schemas/customers";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskEmail } from "@/lib/utils/masking";
import { useUserStore } from "@/stores/userStore";
import { useMemo } from "react";

const getColumns = (isAdmin: boolean): ColumnDef<NewsletterCustomer>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="E-mail" />
        ),
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            return isAdmin ? email : maskEmail(email);
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Inscrito em" />
        ),
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

const renderAdditionalFormFields = (entity?: NewsletterCustomer | null) => (
    <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
            id="email"
            name="email"
            type="email"
            defaultValue={entity?.email ?? ""}
            required
        />
    </div>
);


export default function NewsletterPage() {
    const user = useUserStore((state) => state.user);
    const isAdmin = user?.role === "admin";
    const columns = useMemo(() => getColumns(isAdmin), [isAdmin]);

    return (
        <CrudPage<NewsletterCustomer>
            title="Inscritos na Newsletter"
            description="Gerencie os clientes inscritos na sua newsletter."
            entityName="Inscrito"
            actions={{
                fetch: getNewsletterCustomersAction,
                create: createNewsletterCustomerAction,
                update: updateNewsletterCustomerAction,
                delete: deleteNewsletterCustomerAction,
            }}
            schema={newsletterCustomerSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={renderAdditionalFormFields}
        />
    );
}