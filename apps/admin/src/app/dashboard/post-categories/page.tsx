"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { PostCategory } from "@/lib/types/post";
import {
  getPostCategoriesAction,
  createPostCategoryAction,
  updatePostCategoryAction,
  deletePostCategoryAction,
} from "@/lib/actions/postCategory";
import { postCategorySchema } from "@/lib/schemas/posts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: ColumnDef<PostCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
];

const renderAdditionalFormFields = (entity?: PostCategory | null) => (
  <div className="space-y-2">
    <Label htmlFor="name">Nome</Label>
    <Input
      id="name"
      name="name"
      defaultValue={entity?.name ?? ""}
      required
    />
  </div>
);

export default function PostCategoriesPage() {
  return (
    <CrudPage<PostCategory>
      title="Categorias de Postagem"
      description="Gerencie as categorias de postagem cadastradas."
      entityName="Categoria"
      actions={{
        fetch: getPostCategoriesAction,
        create: createPostCategoryAction,
        update: updatePostCategoryAction,
        delete: deletePostCategoryAction,
      }}
      schema={postCategorySchema}
      additionalColumns={columns}
      renderAdditionalFormFields={renderAdditionalFormFields}
    />
  );
}
