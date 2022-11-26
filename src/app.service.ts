import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Nutrition } from './nutrition.entity';
import { NutritionIngridient } from './nutritions-ingridients.entity';
import {
  AddNutrition,
  SetNutrition,
  GetNutrition,
  IIngridient,
  INutrition,
} from './nutritions.interface';
import { ClientPackageNames } from './package-names.enum';

@Injectable()
export class AppService {
  private logger = new Logger('NutritionsService');

  constructor(
    @Inject(ClientPackageNames.nutritionDeleteTopic)
    private nutritionDeleteTopic: ClientKafka,
    @InjectRepository(Nutrition)
    private nutritionsRepository: Repository<Nutrition>,
    @InjectRepository(NutritionIngridient)
    private nutritionsIngridientRepository: Repository<NutritionIngridient>,
  ) {}

  async listNutritionsByIngridientId(
    ingridient: IIngridient,
  ): Promise<INutrition[]> {
    const nutritionIngridients = await this.nutritionsIngridientRepository.find(
      {
        where: {
          ingridientId: ingridient.id,
        },
        order: {
          id: 'ASC',
        },
      },
    );

    const nutritions = await this.nutritionsRepository.find({
      where: {
        id: In(
          nutritionIngridients.map(
            (nutritionIngridient) => nutritionIngridient.nutrition?.id,
          ),
        ),
      },
    });

    return nutritions.map((nutrition) => ({
      id: nutrition.id,
      name: nutrition.name,
      perGram: nutritionIngridients.find(
        (ni) => ni.nutrition.id === nutrition.id,
      ).perGram,
    }));
  }

  async listNutritions() {
    return await this.nutritionsRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async addNutrition(data: AddNutrition): Promise<Nutrition> {
    const nutrition = this.nutritionsRepository.create({
      name: data.name,
    });

    return await this.nutritionsRepository.save(nutrition);
  }

  async setNutritionToIngridient(data: SetNutrition): Promise<Nutrition> {
    const nutrition = await this.nutritionsRepository.findOne({
      where: {
        id: data.id,
      },
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition not found');
    }

    const nutritionIngridient = this.nutritionsIngridientRepository.create({
      perGram: data.perGram,
      ingridientId: data.ingridientId,
      nutrition,
    });

    await this.nutritionsIngridientRepository.save(nutritionIngridient);

    return nutrition;
  }

  async getNutritionById(data: GetNutrition): Promise<Nutrition> {
    return await this.nutritionsRepository.findOne({
      where: {
        id: data.id,
      },
    });
  }

  async deleteNutrition(id: number): Promise<string> {
    const nutrition = await this.nutritionsRepository.findOne({
      where: {
        id,
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

  async handleIngridientDeleted(ingridientId: number): Promise<void> {
    this.logger.log('ingridient.deleted received');

    const nutritionsIngridients =
      await this.nutritionsIngridientRepository.find({
        where: {
          ingridientId,
        },
      });

    await this.nutritionsIngridientRepository.remove(nutritionsIngridients);

    this.logger.log('nutritions_recipes deleted');

    return;
  }
}
