import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NutritionsGrpcService } from './nutritions-grpc.service';
import {
  SetNutrition,
  GetNutrition,
  IIngredient,
  NutritionsList,
} from '../nutritions.interface';
import { Nutrition } from '../entities/nutrition.entity';

@Controller()
export class NutritionsGrpcController {
  constructor(private readonly service: NutritionsGrpcService) {}

  @GrpcMethod('NutritionsService')
  async listNutritionsByIngredientId(
    ingredient: IIngredient,
  ): Promise<NutritionsList> {
    return {
      nutritions: await this.service.listNutritionsByIngredientId({
        id: ingredient.id,
      }),
    };
  }

  @GrpcMethod('NutritionsService')
  async setNutritionToIngredient(nutrition: SetNutrition): Promise<Nutrition> {
    return await this.service.setNutritionToIngredient(nutrition);
  }

  @GrpcMethod('NutritionsService')
  async removeNutritionDataForIngredient(
    ingredient: IIngredient,
  ): Promise<void> {
    return await this.service.removeNutritionDataForIngredient(ingredient.id);
  }

  @GrpcMethod('NutritionsService')
  async getNutritionById(nutrition: GetNutrition): Promise<Nutrition> {
    return await this.service.getNutritionById(nutrition);
  }
}
