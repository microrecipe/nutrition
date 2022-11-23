import { Body, Controller, Get, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Nutrition } from './nutrition.entity';
import { NutritionsDTO, NutritionsListDTO } from './nutritions.dto';
import { AddNutrition, IIngridient } from './nutritions.interface';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @GrpcMethod('NutritionsService')
  async getNutritionsByIngridientId(
    ingridient: IIngridient,
  ): Promise<Nutrition[]> {
    return this.service.listtNutritionsByIngridientId({
      id: ingridient.id,
    });
  }

  @Get('nutritions')
  async listNutritions(): Promise<NutritionsListDTO> {
    return NutritionsListDTO.toDTO(await this.service.listNutritions());
  }

  @Post('nutritions')
  async addNutrition(@Body() body: AddNutrition): Promise<NutritionsDTO> {
    return NutritionsDTO.toDTO(await this.service.addNutrition(body));
  }
}
