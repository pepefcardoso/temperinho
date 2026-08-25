import { Image } from "./image";
import { Subscription } from "./subscription";

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