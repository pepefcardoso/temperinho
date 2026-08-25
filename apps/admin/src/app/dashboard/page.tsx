import { ActionCard } from "@/components/dashboard/actionCard";

export default function DashboardPage() {
  const userName = "Administrador";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Olá, {userName}! 👋
        </h2>
        <p className="text-muted-foreground mt-2">
          Aqui estão algumas ações rápidas e as últimas atividades.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold tracking-tight mb-4">Ações Rápidas</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Nova Receita"
            description="Adicione uma nova receita ao catálogo."
            href="/dashboard/recipes/new"
            icon="Plus"
          />
          <ActionCard
            title="Novo Post"
            description="Escreva um novo post para o blog."
            href="/dashboard/posts/new"
            icon="FileText"
          />
          <ActionCard
            title="Ver Comentários"
            description="Modere e responda os comentários."
            href="/dashboard/comments"
            icon="MessageSquare"
          />
        </div>
      </div>
    </div>
  );
}