export interface IIngridient {
  id?: number;
}

export interface INutrition {
  id?: number;
  name?: string;
  per_gram?: string;
  ingridient_id?: number;
}

export interface NutritionsList {
  nutritions?: INutrition;
}

export interface AddNutrition {
  name: string;
}

export interface EditNutrition {
  id?: number;
  per_gram?: string;
  ingridient_id?: number;
}
