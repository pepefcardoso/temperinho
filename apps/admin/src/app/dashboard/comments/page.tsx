"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CrudPage } from "@/components/shared/crud/crudPage";
import { Comment } from "@/lib/types/interactions";
import { FetchParams } from "@/lib/types/api";
import {
    getCommentsAction,
    updateCommentAction,
    deleteCommentAction,
} from "@/lib/actions/comment";
import { commentSchema } from "@/lib/schemas/interactions";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/dataTable/dataTableSkeleton";

const CommentsCrud: React.FC<{ type: 'posts' | 'recipes'; id: number; }> = ({ type, id }) => {
    const fetchAction = (params: FetchParams) => getCommentsAction(type, id, params);

    const columns: ColumnDef<Comment>[] = useMemo(() => [
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
            accessorKey: "content",
            header: "Comentário",
            cell: ({ row }) => <p className="line-clamp-2 max-w-sm">{row.getValue("content")}</p>,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
            cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR", {
                hour: '2-digit', minute: '2-digit'
            }),
        },
    ], []);

    const renderAdditionalFormFields = (entity?: Comment | null) => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="content">Conteúdo do Comentário</Label>
                <Textarea id="content" name="content" defaultValue={entity?.content ?? ""} required rows={5} />
            </div>
            {/* Corrigido: Agora 'commentable' existe no tipo Comment */}
            {entity?.commentable && (
                <div className="space-y-2">
                    <Label>Associado a</Label>
                    <Badge variant="secondary">{entity.commentable.type === 'post' ? 'Post' : 'Receita'} #{entity.commentable.id}</Badge>
                </div>
            )}
        </div>
    );

    return (
        <CrudPage<Comment>
            title=""
            description=""
            entityName="Comentário"
            actions={{
                fetch: fetchAction,
                create: async () => ({ success: false, message: "Não suportado" }),
                update: updateCommentAction,
                delete: deleteCommentAction,
            }}
            schema={commentSchema.pick({ content: true })}
            additionalColumns={columns}
            renderAdditionalFormFields={renderAdditionalFormFields}
            isCreateEnabled={false}
        />
    );
};

export default function CommentsPage() {
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
        <EntityPage
            title="Gerenciar Comentários"
            description="Busque e modere os comentários de um post ou receita específica."
        >
            <Card>
                <CardHeader>
                    <CardTitle>Buscar Comentários</CardTitle>
                    <CardDescription>Selecione o tipo de conteúdo e o ID para carregar os comentários.</CardDescription>
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
                    <CommentsCrud type={submittedParams.type} id={submittedParams.id} />
                ) : (
                    <div className="pt-8">
                        <EmptyState title="Nenhuma busca realizada" description="Para começar, selecione um tipo, insira um ID e clique em buscar." />
                    </div>
                )}
            </div>
        </EntityPage>
    );
}