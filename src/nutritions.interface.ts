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
