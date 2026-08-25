"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast, Toaster } from "sonner";
import { CrudPage } from "@/components/shared/crud/crudPage";
import { Rating } from "@/lib/types/interactions";
import { FetchParams } from "@/lib/types/api";
import {
    getRatingsAction,
    updateRatingAction,
    deleteRatingAction,
} from "@/lib/actions/rating";
import { ratingSchema } from "@/lib/schemas/interactions";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/dataTable/dataTableSkeleton";
import { Star } from "lucide-react";

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`h-5 w-5 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">({rating.toFixed(1)})</span>
    </div>
);

const RatingsCrud: React.FC<{ type: 'posts' | 'recipes'; id: number; }> = ({ type, id }) => {
    const fetchAction = (params: FetchParams) => getRatingsAction(type, id, params);

    const columns: ColumnDef<Rating>[] = useMemo(() => [
        {
            accessorKey: "author",
            header: "Autor",
            cell: ({ row }) => {
                const author = row.original.author;
                return author ? (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={author.image?.url} alt={author.name} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{author.name}</span>
                    </div>
                ) : "N/A";
            },
        },
        {
            accessorKey: "value",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Avaliação" />,
            cell: ({ row }) => <StarRating rating={row.getValue("value")} />,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
            cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR", {
                hour: '2-digit', minute: '2-digit'
            }),
        },
    ], []);

    const renderAdditionalFormFields = (entity?: Rating | null) => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="rating">Nota (1 a 5)</Label>
                <Input
                    id="value"
                    name="value"
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    defaultValue={entity?.value ?? ""}
                    required
                />
            </div>
        </div>
    );

    return (
        <CrudPage<Rating>
            title=""
            description=""
            entityName="Avaliação"
            actions={{
                fetch: fetchAction,
                update: updateRatingAction,
                delete: deleteRatingAction,
            }}
            schema={ratingSchema.pick({ value: true })}
            additionalColumns={columns}
            renderAdditionalFormFields={renderAdditionalFormFields}
            isCreateEnabled={false}
        />
    );
};

export default function RatingsPage() {
    const [searchParams, setSearchParams] = useState<{ type: 'posts' | 'recipes' | ''; id: string }>({ type: '', id: '' });
    const [submittedParams, setSubmittedParams] = useState<{ type: 'posts' | 'recipes'; id: number } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchParams.type || !searchParams.id) {
            toast.error("Por favor, selecione um tipo e insira um ID.");
            return;
        }
        setSubmittedParams({ type: searchParams.type, id: Number(searchParams.id) });
    };

    return (
        <>
            <Toaster richColors position="top-right" />
            <EntityPage
                title="Gerenciar Avaliações"
                description="Busque e modere as avaliações de um post ou receita específica."
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Avaliações</CardTitle>
                        <CardDescription>Selecione o tipo de conteúdo e o ID para carregar as avaliações.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
                            <div className="w-full sm:w-auto space-y-2">
                                <Label htmlFor="type-select">Tipo de Conteúdo</Label>
                                <Select onValueChange={(value: 'posts' | 'recipes') => setSearchParams(p => ({ ...p, type: value }))} value={searchParams.type}>
                                    <SelectTrigger id="type-select" className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="posts">Post</SelectItem>
                                        <SelectItem value="recipes">Receita</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full sm:w-auto space-y-2 flex-grow">
                                <Label htmlFor="id-input">ID do Conteúdo</Label>
                                <Input id="id-input" type="number" placeholder="Ex: 123" value={searchParams.id} onChange={(e) => setSearchParams(p => ({ ...p, id: e.target.value }))} />
                            </div>
                            <Button type="submit">Buscar</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    {submittedParams ? (
                        <RatingsCrud type={submittedParams.type} id={submittedParams.id} />
                    ) : (
                        <div className="pt-8">
                            <EmptyState title="Nenhuma busca realizada" description="Para começar, selecione um tipo, insira um ID e clique em buscar." />
                        </div>
                    )}
                </div>
            </EntityPage>
        </>
    );
}