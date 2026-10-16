import { Author } from "./user";

export type Report = {
  id: number;
  reportable_type: string;
  reportable_id: number;
  reason: "spam" | "inappropriate" | "misinformation" | "other";
  comment?: string | null;
  status: "pending" | "reviewed";
  reporter?: Author | null;
  created_at: string;
};
