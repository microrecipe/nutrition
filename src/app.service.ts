import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Nutrition } from './nutrition.entity';
import {
  AddNutrition,
  EditNutrition,
  IIngridient,
} from './nutritions.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Nutrition)
    private repository: Repository<Nutrition>,
  ) {}

  async listNutritionsByIngridientId(
    ingridient: IIngridient,
  ): Promise<Nutrition[]> {
    const nutritions = await this.repository.find({
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
    return await this.repository.find();
  }

  async addNutrition(data: AddNutrition): Promise<Nutrition> {
    const nutrition = this.repository.create({
      name: data.name,
    });

    return await this.repository.save(nutrition);
  }

  async editNutrition(data: EditNutrition): Promise<Nutrition> {
    const nutrition = await this.repository.findOne({
      where: {
        id: data.id,
      },
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition not found');
    }

    nutrition.ingridientId = data.ingridient_id;
    nutrition.perGram = data.per_gram;

    await this.repository.save(nutrition);

    return nutrition;
  }
}
