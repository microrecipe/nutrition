export interface IIngredient {
  id?: number;
}

export interface INutrition {
  id?: number;
  name?: string;
  perGram?: string;
  ingredientId?: number;
}

export interface NutritionsList {
  nutritions?: INutrition[];
}

export interface GetNutrition {
  id: number;
}

export interface AddNutrition {
  name: string;
}

export interface SetNutrition {
  id: number;
  perGram: string;
  ingredientId: number;
}

export interface HandleIngredientDeletePayload {
  ingredient_id: number;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface UserId {
  id: number;
}
