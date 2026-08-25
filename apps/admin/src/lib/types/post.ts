import { Image } from "./image";
import { Author } from "./user";

export type PostCategory = {
  id: number;
  name: string;
};

export type PostTopic = {
  id: number;
  name: string;
};

type PostBase = {
  id: number;
  title: string;
  summary: string;
  image?: Image | null;
  category?: PostCategory | null;
  author?: Author | null;
  average_rating: number;
  ratings_count?: number;
  is_favorited: boolean;
  created_at: string;
  company_id?: number | null;
};

export type PostCollectionItem = PostBase;

export type Post = PostBase & {
  content: string;
  topics?: PostTopic[];
  updated_at: string;
};