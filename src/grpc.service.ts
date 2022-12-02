import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nutrition } from './nutrition.entity';
import { NutritionIngredient } from './nutritions-ingredients.entity';
import {
  GetNutrition,
  IIngredient,
  INutrition,
  SetNutrition,
} from './nutritions.interface';

@Injectable()
export class GrpcService {
  constructor(
    @InjectRepository(Nutrition)
    private nutritionsRepository: Repository<Nutrition>,
    @InjectRepository(NutritionIngredient)
    private nutritionsIngredientRepository: Repository<NutritionIngredient>,
  ) {}

  async listNutritionsByIngredientId(
    ingredient: IIngredient,
  ): Promise<INutrition[]> {
    const nutritionIngredients = await this.nutritionsIngredientRepository.find(
      {
        where: {
          ingredientId: ingredient.id,
        },
        order: {
          id: 'ASC',
        },
      },
    );

    const nutritions = await this.nutritionsRepository.find({
      where: {
        id: In(
          nutritionIngredients.map(
            (nutritionIngredient) => nutritionIngredient.nutrition?.id,
          ),
        ),
      },
    });

    return nutritions.map((nutrition) => ({
      id: nutrition.id,
      name: nutrition.name,
      perGram: nutritionIngredients.find(
        (ni) => ni.nutrition.id === nutrition.id,
      )?.perGram,
    }));
  }

  async setNutritionToIngredient(data: SetNutrition): Promise<Nutrition> {
    const nutrition = await this.nutritionsRepository.findOne({
      where: {
        id: data.id,
      },
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition not found');
    }

    const nutritionIngredient = this.nutritionsIngredientRepository.create({
      perGram: data.perGram,
      ingredientId: data.ingredientId,
      nutrition,
    });

    await this.nutritionsIngredientRepository.save(nutritionIngredient);

    return nutrition;
  }

  async getNutritionById(data: GetNutrition): Promise<Nutrition> {
    return await this.nutritionsRepository.findOne({
      where: {
        id: data.id,
      },
    });
  }
}
