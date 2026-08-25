"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { Company } from "@/lib/types/company";
import {
    getCompaniesAction,
    createCompanyAction,
    updateCompanyAction,
    deleteCompanyAction,
} from "@/lib/actions/companies";
import { companySchema } from "@/lib/schemas/company";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { maskEmail, maskPhone, maskCnpj } from "@/lib/utils/masking";
import { useUserStore } from "@/stores/userStore";
import { useMemo } from "react";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
};

const getColumns = (isAdmin: boolean): ColumnDef<Company>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "image",
        header: "Imagem",
        cell: ({ row }) => {
            const company = row.original;
            return (
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={company.image?.url}
                        alt={`${company.name} logo`}
                    />
                    <AvatarFallback>
                        {company.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nome" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "cnpj",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="CNPJ" />
        ),
        cell: ({ row }) => {
            const cnpj = row.getValue("cnpj") as string;
            return isAdmin ? cnpj : maskCnpj(cnpj);
        },
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
        accessorKey: "phone",
        header: "Telefone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            if (!phone) return "-";
            return isAdmin ? phone : maskPhone(phone);
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Criado em" />
        ),
        cell: ({ row }) => formatDate(row.getValue("created_at")),
    },
];

const AdditionalFormFields: React.FC<{ entity?: Company | null }> = ({ entity }) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={entity?.name ?? ""}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                    id="cnpj"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    defaultValue={entity?.cnpj ?? ""}
                    required
                />
            </div>

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

            <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    defaultValue={entity?.phone ?? ""}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                    id="address"
                    name="address"
                    defaultValue={entity?.address ?? ""}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://exemplo.com"
                    defaultValue={entity?.website ?? ""}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="user">ID do Usuário</Label>
                <Input
                    id="user"
                    name="user"
                    type="number"
                    defaultValue={entity?.user ?? ""}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Logo da Empresa</Label>
                <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                />
                {entity?.image && (
                    <div className="mt-2">
                        <Image
                            src={entity.image.url}
                            alt="Logo atual"
                            className="h-16 w-16 rounded object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default function CompaniesPage() {
    const user = useUserStore((state) => state.user);
    const isAdmin = user?.role === "admin";
    const columns = useMemo(() => getColumns(isAdmin), [isAdmin]);

    return (
        <CrudPage<Company>
            title="Empresas"
            description="Gerencie as empresas cadastradas no sistema."
            entityName="Empresa"
            actions={{
                fetch: getCompaniesAction,
                create: createCompanyAction,
                update: updateCompanyAction,
                delete: deleteCompanyAction,
            }}
            schema={companySchema}
            additionalColumns={columns}
            renderAdditionalFormFields={(entity) => <AdditionalFormFields entity={entity} />}
        />
    );
}