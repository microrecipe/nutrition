import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NutritionsDTO } from './nutritions.dto';
import { AddNutrition } from './nutritions.interface';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('nutritions')
  async listNutritions(): Promise<NutritionsDTO[]> {
    return (await this.service.listNutritions()).map((nutrition) =>
      NutritionsDTO.toDTO(nutrition),
    );
  }

  @Post('nutritions')
  async addNutrition(@Body() body: AddNutrition): Promise<NutritionsDTO> {
    return NutritionsDTO.toDTO(await this.service.addNutrition(body));
  }
}
