import { Author } from "./user";

export type Commentable = {
  id: number;
  type: 'post' | 'recipe';
  title?: string;
};

export type Comment = {
  id: number;
  content: string;
  author?: Author;
  commentable?: Commentable;
  created_at: string;
  updated_at: string;
};

export type Rating = {
  id: number;
  value: number;
  comment?: string;
  author?: Author;
  created_at: string;
};