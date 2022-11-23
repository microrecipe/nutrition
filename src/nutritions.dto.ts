import { Nutrition } from './nutrition.entity';

export class NutritionsDTO {
  static toDTO(nutrition: Nutrition) {
    const res = new NutritionsDTO();

    res.id = nutrition.id;
    res.name = nutrition.name;
    res.per_gram = nutrition.perGram;
    res.ingridient_id = nutrition.ingridientId;

    return res;
  }
  id: number;
  name: string;
  per_gram: string;
  ingridient_id: number;
}

export class NutritionsListDTO {
  static toDTO(nutritions: Nutrition[]) {
    const res = new NutritionsListDTO();
    res.nutritions = nutritions.map((nutrition) =>
      NutritionsDTO.toDTO(nutrition),
    );
    return res;
  }
  nutritions: NutritionsDTO[];
}
