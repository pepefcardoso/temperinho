import { Image } from "./image";

export type Company = {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  image?: Image | null;
  user: number;
  created_at: string;
  subscriptions?: Subscription[];
};

export type Subscription = {
  id: number;
  company_id: number;
  plan_id: number;
  starts_at: string;
  ends_at: string;
  status: string;
  created_at: string;
};

export type PlanLimits = {
  users: number;
  posts: number;
  recipes: number;
  banners: number;
  email_campaigns: number;
};

export type Plan = {
  id: number;
  name: string;
  badge: string;
  price: string;
  period: 'Mensal' | 'Anual';
  description: string;
  features: string[];
  status: string;
  display_order: number;
  limits: PlanLimits;
  newsletter: boolean;
  trial_days: number;
  is_popular: boolean;
  created_at: string;
};