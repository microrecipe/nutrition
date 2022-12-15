import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { NutritionIngredient } from '../entities/nutrition-ingredient.entity';
import { Nutrition } from '../entities/nutrition.entity';
import { NutritionsDTO } from '../nutritions.dto';
import { ClientPackageNames } from '../nutritions.enum';
import { AddNutrition, UserType } from '../nutritions.interface';

@Injectable()
export class NutritionsService {
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

  async getNutritionById(id: number): Promise<NutritionsDTO> {
    try {
      const nutrition = await this.nutritionsRepository.findOneByOrFail({
        id,
      });

      return NutritionsDTO.toDTO(nutrition);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException('Nutrition not found');
      } else {
        throw err;
      }
    }
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
    try {
      const nutrition = await this.nutritionsRepository.findOneByOrFail({
        id,
        userId: user.id,
      });

      await this.nutritionsRepository.softRemove(nutrition);

      this.nutritionDeleteTopic
        .emit('nutrition.deleted', { nutrition_id: id })
        .forEach(() => {
          this.logger.log('nutrition.deleted emitted');
        });

      return 'Nutrition deleted';
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException('Nutrition not found');
      } else {
        throw err;
      }
    }
  }

  async handleIngredientDeleted(ingredientId: number): Promise<void> {
    this.logger.log('ingredient.deleted received');

    const nutritionsIngredients =
      await this.nutritionsIngredientRepository.findOneByOrFail({
        ingredientId,
      });

    await this.nutritionsIngredientRepository.softRemove(nutritionsIngredients);

    this.logger.log('nutritions_recipes deleted');

    return;
  }
}
