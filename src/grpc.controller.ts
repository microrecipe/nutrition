import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import { Nutrition } from './nutrition.entity';
import {
  SetNutrition,
  GetNutrition,
  IIngredient,
  NutritionsList,
} from './nutritions.interface';

@Controller()
export class GrpcController {
  constructor(private readonly service: GrpcService) {}

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
  async getNutritionById(nutrition: GetNutrition): Promise<Nutrition> {
    return await this.service.getNutritionById(nutrition);
  }
}
