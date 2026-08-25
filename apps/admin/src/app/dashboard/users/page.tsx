"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { User } from "@/lib/types/user";
import {
    getUsersAction,
    createUserAction,
    updateUserAction,
    deleteUserAction,
} from "@/lib/actions/users";
import { userSchema } from "@/lib/schemas/users";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { maskEmail, maskPhone } from "@/lib/utils/masking";
import { useUserStore } from "@/stores/userStore";
import { useMemo } from "react";

const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
};

const getColumns = (isAdmin: boolean): ColumnDef<User>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "image",
        header: "Avatar",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={user.image?.url}
                        alt={`${user.name} avatar`}
                    />
                    <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
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
        accessorKey: "role",
        header: "Papel",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            if (!role) return "-";
            return (
                <Badge variant={role === "admin" ? "destructive" : "secondary"}>
                    {role}
                </Badge>
            );
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
        accessorKey: "birthday",
        header: "Aniversário",
        cell: ({ row }) => formatDate(row.getValue("birthday")),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Criado em" />
        ),
        cell: ({ row }) => formatDate(row.getValue("created_at")),
    },
];

const AdditionalFormFields: React.FC<{ entity?: User | null }> = ({ entity }) => {
    const isEditing = !!entity;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={entity?.name ?? ""}
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
                <Label htmlFor="role">Papel</Label>
                <Input
                    id="role"
                    name="role"
                    placeholder="admin, user, moderator..."
                    defaultValue={entity?.role ?? ""}
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
                <Label htmlFor="birthday">Data de Nascimento</Label>
                <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    defaultValue={entity?.birthday?.split('T')[0] ?? ""}
                />
            </div>

            {!isEditing && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required={!isEditing}
                        />
                    </div>
                </>
            )}

            <div className="space-y-2">
                <Label htmlFor="image">Foto de Perfil</Label>
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
                            alt="Foto atual"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default function UsersPage() {
    const user = useUserStore((state) => state.user);
    const isAdmin = user?.role === "admin";
    const columns = useMemo(() => getColumns(isAdmin), [isAdmin]);

    return (
        <CrudPage<User>
            title="Usuários"
            description="Gerencie os usuários cadastrados no sistema."
            entityName="Usuário"
            actions={{
                fetch: getUsersAction,
                create: createUserAction,
                update: updateUserAction,
                delete: deleteUserAction,
            }}
            schema={userSchema}
            additionalColumns={columns}
            renderAdditionalFormFields={(entity) => <AdditionalFormFields entity={entity} />}
        />
    );
}