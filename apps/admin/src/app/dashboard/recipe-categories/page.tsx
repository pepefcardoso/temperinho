"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { RecipeCategory } from "@/lib/types/recipe";
import {
  getRecipeCategoriesAction,
  createRecipeCategoryAction,
  updateRecipeCategoryAction,
  deleteRecipeCategoryAction,
} from "@/lib/actions/recipeCategory";
import { recipeCategorySchema } from "@/lib/schemas/recipes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: ColumnDef<RecipeCategory>[] = [
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

const renderAdditionalFormFields = (entity?: RecipeCategory | null) => (
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


export default function RecipeCategoriesPage() {
  return (
    <CrudPage<RecipeCategory>
      title="Categorias de Receita"
      description="Gerencie as categorias de receitas cadastradas."
      entityName="Categoria"
      actions={{
        fetch: getRecipeCategoriesAction,
        create: createRecipeCategoryAction,
        update: updateRecipeCategoryAction,
        delete: deleteRecipeCategoryAction,
      }}
      schema={recipeCategorySchema}
      additionalColumns={columns}
      renderAdditionalFormFields={renderAdditionalFormFields}
    />
  );
}
