export interface Ingridient {
  id: number;
}

export interface Nutrition {
  ingridient: Ingridient;
  calories: string;
  fat: string;
  sodium: string;
  fiber: string;
  sugar: string;
  protein: string;
}
