"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { RecipeUnit } from "@/lib/types/recipe";
import {
  getRecipeUnitsAction,
  createRecipeUnitAction,
  updateRecipeUnitAction,
  deleteRecipeUnitAction,
} from "@/lib/actions/recipeUnit";
import { recipeUnitSchema } from "@/lib/schemas/recipes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: ColumnDef<RecipeUnit>[] = [
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

const renderAdditionalFormFields = (entity?: RecipeUnit | null) => (
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


export default function RecipeUnitsPage() {
  return (
    <CrudPage<RecipeUnit>
      title="Unidades de Receita"
      description="Gerencie as unidades de receitas cadastradas."
      entityName="Unidade"
      actions={{
        fetch: getRecipeUnitsAction,
        create: createRecipeUnitAction,
        update: updateRecipeUnitAction,
        delete: deleteRecipeUnitAction,
      }}
      schema={recipeUnitSchema}
      additionalColumns={columns}
      renderAdditionalFormFields={renderAdditionalFormFields}
    />
  );
}