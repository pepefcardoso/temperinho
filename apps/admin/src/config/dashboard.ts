import { type IconName } from "@/components/ui/icon";

export type NavItem = {
  title: string;
  href: string;
  icon: IconName;
  label?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const dashboardNavItem: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: "LayoutDashboard",
};

export const navGroups: NavGroup[] = [
  {
    title: "Geral",
    items: [
      {
        title: "Empresas",
        href: "/dashboard/companies",
        icon: "Building2",
      },
      {
        title: "Usuários",
        href: "/dashboard/users",
        icon: "Users",
      },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      {
        title: "Posts",
        href: "/dashboard/posts",
        icon: "FileText",
      },
      {
        title: "Categorias de Post",
        href: "/dashboard/post-categories",
        icon: "Folder",
      },
      {
        title: "Tópicos de Post",
        href: "/dashboard/post-topics",
        icon: "Tag",
      },
      {
        title: "Receitas",
        href: "/dashboard/recipes",
        icon: "BookOpen",
      },
      {
        title: "Categorias de Receitas",
        href: "/dashboard/recipe-categories",
        icon: "FolderKanban",
      },
      {
        title: "Dietas de Receita",
        href: "/dashboard/recipe-diets",
        icon: "Leaf",
      },
      {
        title: "Unidades de Receita",
        href: "/dashboard/recipe-units",
        icon: "Pipette",
      },
    ],
  },
  {
    title: "Engajamento",
    items: [
      {
        title: "Comentários",
        href: "/dashboard/comments",
        icon: "MessageSquare",
      },
      {
        title: "Avaliações",
        href: "/dashboard/ratings",
        icon: "Star",
      },
      {
        title: "Contatos",
        href: "/dashboard/contacts",
        icon: "Contact",
      },
      {
        title: "Newsletter",
        href: "/dashboard/newsletter",
        icon: "Mail",
      },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        title: "Pagamentos",
        href: "/dashboard/payments",
        icon: "CreditCard",
      },
      {
        title: "Inscrições",
        href: "/dashboard/subscriptions",
        icon: "Repeat",
      },
      {
        title: "Planos",
        href: "/dashboard/plans",
        icon: "Bookmark",
      },
      {
        title: "Métodos de Pagamento",
        href: "/dashboard/payment-methods",
        icon: "Wallet",
      },
    ],
  },
];

export const dashboardConfig = {
  dashboardNavItem,
  navGroups,
};
