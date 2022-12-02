import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Nutrition } from './nutrition.entity';
import { NutritionIngredient } from './nutritions-ingredients.entity';
import { NutritionsDTO } from './nutritions.dto';
import { AddNutrition, UserType } from './nutritions.interface';
import { ClientPackageNames } from './package-names.enum';

@Injectable()
export class AppService {
  private logger = new Logger('NutritionsService');

  constructor(
    @Inject(ClientPackageNames.nutritionDeleteTopic)
    private nutritionDeleteTopic: ClientKafka,
    @InjectRepository(Nutrition)
    private nutritionsRepository: Repository<Nutrition>,
    @InjectRepository(NutritionIngredient)
    private nutritionsIngredientRepository: Repository<NutritionIngredient>,
  ) {}

  async listNutritions(): Promise<NutritionsDTO[]> {
    const nutritions = await this.nutritionsRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return nutritions.map((nutrition) => NutritionsDTO.toDTO(nutrition));
  }

  async addNutrition(
    data: AddNutrition,
    user: UserType,
  ): Promise<NutritionsDTO> {
    const nutrition = await this.nutritionsRepository.save(
      this.nutritionsRepository.create({
        name: data.name,
        userId: user.id,
      }),
    );

    return NutritionsDTO.toDTO(nutrition);
  }

  async deleteNutrition(id: number, user: UserType): Promise<string> {
    const nutrition = await this.nutritionsRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition not found');
    }

    await this.nutritionsRepository.remove(nutrition);

    this.nutritionDeleteTopic
      .emit('nutrition.deleted', { nutrition_id: id })
      .forEach(() => {
        this.logger.log('nutrition.deleted emitted');
      });

    return 'Nutrition deleted';
  }

  async handleIngredientDeleted(ingredientId: number): Promise<void> {
    this.logger.log('ingredient.deleted received');

    const nutritionsIngredients =
      await this.nutritionsIngredientRepository.find({
        where: {
          ingredientId: ingredientId,
        },
      });

    await this.nutritionsIngredientRepository.remove(nutritionsIngredients);

    this.logger.log('nutritions_recipes deleted');

    return;
  }
}
