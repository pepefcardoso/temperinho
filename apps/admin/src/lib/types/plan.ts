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
  created_at: string;
};