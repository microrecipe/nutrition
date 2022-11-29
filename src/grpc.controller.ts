import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import { Nutrition } from './nutrition.entity';
import {
  SetNutrition,
  GetNutrition,
  IIngridient,
  NutritionsList,
} from './nutritions.interface';

@Controller()
export class GrpcController {
  constructor(private readonly service: GrpcService) {}

  @GrpcMethod('NutritionsService')
  async listNutritionsByIngridientId(
    ingridient: IIngridient,
  ): Promise<NutritionsList> {
    return {
      nutritions: await this.service.listNutritionsByIngridientId({
        id: ingridient.id,
      }),
    };
  }

  @GrpcMethod('NutritionsService')
  async setNutritionToIngridient(nutrition: SetNutrition): Promise<Nutrition> {
    return await this.service.setNutritionToIngridient(nutrition);
  }

  @GrpcMethod('NutritionsService')
  async getNutritionById(nutrition: GetNutrition): Promise<Nutrition> {
    return await this.service.getNutritionById(nutrition);
  }
}
