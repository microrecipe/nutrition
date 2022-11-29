export interface IIngridient {
  id?: number;
}

export interface INutrition {
  id?: number;
  name?: string;
  perGram?: string;
  ingridientId?: number;
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
  ingridientId: number;
}

export interface HandleIngridientDeletePayload {
  ingridient_id: number;
}

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
}

export type UserType = TokenPayload;

export interface UserId {
  id: number;
}
