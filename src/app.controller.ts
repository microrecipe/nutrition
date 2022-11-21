import { Controller, Get } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Ingridient, Nutrition } from './nutritions.interface';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @GrpcMethod('NutritionsService')
  getNutritionByIngridientId(ingridient: Ingridient): Nutrition {
    return this.service.getNutritionByIngridientId(ingridient.id);
  }

  @MessagePattern('getNutrition')
  _getNutritionByIngridientId(ingridient: Ingridient): Nutrition {
    return this.service.getNutritionByIngridientId(ingridient.id);
  }
}
