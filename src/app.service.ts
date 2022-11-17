import { Injectable, NotFoundException } from '@nestjs/common';
import { Nutrition } from './nutritions.interface';

const Nutritions: Nutrition[] = [
  // chicken leg
  {
    ingridient: { id: 1 },
    calories: '475',
    fat: '23.2g',
    sodium: '253mg',
    fiber: '0g',
    sugar: '0g',
    protein: '61.9g',
  },
  // onion
  {
    ingridient: { id: 2 },
    calories: '40',
    fat: '0.1g',
    sodium: '0g',
    fiber: '1.7g',
    sugar: '4.2g',
    protein: '1.1g',
  },
  // carrot
  {
    ingridient: { id: 3 },
    calories: '25',
    fat: '0g',
    sodium: '0g',
    fiber: '1.5g',
    sugar: '4.2g',
    protein: '1.1g',
  },
  // vegetable oil
  {
    ingridient: { id: 4 },
    calories: '884',
    fat: '100g',
    sodium: '0g',
    fiber: '1.5g',
    sugar: '4.2g',
    protein: '1.1g',
  },
];

@Injectable()
export class AppService {
  getNutritionByIngridientId(ingridientId: number): Nutrition {
    const nutrition = Nutritions.find(
      (nutrition) => nutrition.ingridient.id === ingridientId,
    );

    if (!nutrition) {
      throw new NotFoundException('Nutrition not found');
    }

    return nutrition;
  }
}
