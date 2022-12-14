import { Nutrition } from './entities/nutrition.entity';

export class NutritionsDTO {
  static toDTO(nutrition: Nutrition) {
    const res = new NutritionsDTO();

    res.id = nutrition.id;
    res.name = nutrition.name;

    return res;
  }
  id: number;
  name: string;
  per_gram: string;
  ingredient_id: number;
}
