import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NutritionsDTO, NutritionsListDTO } from './nutritions.dto';
import { AddNutrition } from './nutritions.interface';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('nutritions')
  async listNutritions(): Promise<NutritionsListDTO> {
    return NutritionsListDTO.toDTO(await this.service.listNutritions());
  }

  @Post('nutritions')
  async addNutrition(@Body() body: AddNutrition): Promise<NutritionsDTO> {
    return NutritionsDTO.toDTO(await this.service.addNutrition(body));
  }
}
