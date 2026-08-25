import { Image } from "./image";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "INTERNAL" | "CUSTOMER";
  image: Image | null;
  phone?: string;
  birthday?: string;
  created_at: string;
}
