import { Image } from "./image";
import { Author } from "./user";

export type RecipeCategory = {
  id: number;
  name: string;
};

export type RecipeDiet = {
  id: number;
  name: string;
};

export type RecipeUnit = {
  id: number;
  name: string;
};

export type RecipeStep = {
  order: number;
  description: string;
};

export type RecipeIngredient = {
  id: number;
  name: string;
  quantity: string;
  unit?: RecipeUnit | null;
};

type RecipeBase = {
  id: number;
  title: string;
  description: string;
  time: string;
  portion: string;
  difficulty: string;
  image?: Image | null;
  category?: RecipeCategory | null;
  diets?: RecipeDiet[];
  average_rating: number;
  ratings_count?: number;
  is_favorited: boolean;
  company_id?: number | null;
};

export type RecipeCollectionItem = RecipeBase;

export type Recipe = RecipeBase & {
  author?: Author | null;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
};