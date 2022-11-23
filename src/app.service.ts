import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Nutrition } from './nutrition.entity';
import { AddNutrition, IIngridient } from './nutritions.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Nutrition)
    private nutritionsRepository: Repository<Nutrition>,
  ) {}

  async listtNutritionsByIngridientId(
    ingridient: IIngridient,
  ): Promise<Nutrition[]> {
    const nutritions = await this.nutritionsRepository.find({
      where: {
        ingridientId: ingridient.id,
      },
    });

    if (nutritions.length < 1) {
      throw new NotFoundException('Nutrition not found');
    }

    return nutritions;
  }

  async listNutritions() {
    return await this.nutritionsRepository.find();
  }

  async addNutrition(data: AddNutrition) {
    const nutrition = this.nutritionsRepository.create({
      name: data.name,
    });

    return await this.nutritionsRepository.save(nutrition);
  }
}
