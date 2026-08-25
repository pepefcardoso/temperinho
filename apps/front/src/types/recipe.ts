import { User } from "@/types/user";
import { Image } from "./image";

export type RecipeDifficulty = 1 | 2 | 3 | 4 | 5;

export const RecipeDifficultyLabels: Record<RecipeDifficulty, string> = {
  1: 'Muito Fácil',
  2: 'Fácil',
  3: 'Médio',
  4: 'Difícil',
  5: 'Muito Difícil',
};

export interface RecipeCategory {
  id: number;
  name: string;
  normalized_name: string;
}

export interface RecipeDiet {
  id: number;
  name: string;
  normalized_name: string;
}

export interface RecipeUnit {
  id: number;
  name: string;
  normalized_name: string;
}

export interface RecipeIngredient {
  id: number;
  quantity: string;
  name: string;
  unit?: RecipeUnit;
  unit_id: number;
}

export interface RecipeStep {
  id: number;
  order: number;
  description: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  time: number;
  portion: number;
  difficulty: RecipeDifficulty;
  user_id: number;
  user?: User;
  category_id: number;
  category?: RecipeCategory;
  diets?: RecipeDiet[];
  steps?: RecipeStep[];
  ingredients?: RecipeIngredient[];
  image?: Image;
  is_favorited?: boolean;
  average_rating?: number;
  ratings_count?: number;
  created_at: string;
  updated_at: string;
}
