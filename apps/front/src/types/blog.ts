import { Image } from "./image";
import { User } from "./user";

export interface PostCategory {
  id: number;
  name: string;
  normalized_name: string;
}

export interface PostTopic {
  id: number;
  name: string;
  normalized_name: string;
}

export interface Post {
  id: number;
  title: string;
  summary: string;
  content?: string;
  image?: Image;
  author?: User;
  category?: PostCategory;
  topics?: PostTopic[];
  average_rating?: number;
  ratings_count?: number;
  is_favorited?: boolean;
  created_at: string;
  updated_at?: string;
}