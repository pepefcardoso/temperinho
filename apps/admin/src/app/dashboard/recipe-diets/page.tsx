"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { RecipeDiet } from "@/lib/types/recipe";
import {
  getRecipeDietsAction,
  createRecipeDietAction,
  updateRecipeDietAction,
  deleteRecipeDietAction,
} from "@/lib/actions/recipeDiet";
import { recipeDietSchema } from "@/lib/schemas/recipes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: ColumnDef<RecipeDiet>[] = [
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

const renderAdditionalFormFields = (entity?: RecipeDiet | null) => (
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

export default function RecipeDietsPage() {
  return (
    <CrudPage<RecipeDiet>
      title="Dietas de Receita"
      description="Gerencie as dietas de receitas cadastradas."
      entityName="Dieta"
      actions={{
        fetch: getRecipeDietsAction,
        create: createRecipeDietAction,
        update: updateRecipeDietAction,
        delete: deleteRecipeDietAction,
      }}
      schema={recipeDietSchema}
      additionalColumns={columns}
      renderAdditionalFormFields={renderAdditionalFormFields}
    />
  );
}
