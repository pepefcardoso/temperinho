import { Image } from "./image";

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  image?: Image | null;
  phone?: string | null;
  birthday?: string | null;
  created_at?: string;
};

export type Author = {
  id: number;
  name: string;
  image?: Image | null;
};