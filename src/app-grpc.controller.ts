import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Nutrition } from './nutrition.entity';
import { EditNutrition, IIngridient } from './nutritions.interface';

@Controller()
export class GrpcController {
  constructor(private readonly service: AppService) {}

  @GrpcMethod('NutritionsService')
  async getNutritionsByIngridientId(
    ingridient: IIngridient,
  ): Promise<Nutrition[]> {
    return this.service.listNutritionsByIngridientId({
      id: ingridient.id,
    });
  }

  @GrpcMethod('NutritionsService')
  async editNutrition(nutrition: EditNutrition): Promise<Nutrition> {
    return await this.service.editNutrition(nutrition);
  }
}
