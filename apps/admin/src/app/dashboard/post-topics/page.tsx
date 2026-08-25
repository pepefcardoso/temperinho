"use client";

import { CrudPage } from "@/components/shared/crud/crudPage";
import { PostTopic } from "@/lib/types/post";
import {
  getPostTopicsAction,
  createPostTopicAction,
  updatePostTopicAction,
  deletePostTopicAction,
} from "@/lib/actions/postTopic";
import { postTopicSchema } from "@/lib/schemas/posts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: ColumnDef<PostTopic>[] = [
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

const renderAdditionalFormFields = (entity?: PostTopic | null) => (
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

export default function PostTopicsPage() {
  return (
    <CrudPage<PostTopic>
      title="Tópicos de Postagem"
      description="Gerencie os tópicos de postagem cadastrados."
      entityName="Tópico"
      actions={{
        fetch: getPostTopicsAction,
        create: createPostTopicAction,
        update: updatePostTopicAction,
        delete: deletePostTopicAction,
      }}
      schema={postTopicSchema}
      additionalColumns={columns}
      renderAdditionalFormFields={renderAdditionalFormFields}
    />
  );
}
