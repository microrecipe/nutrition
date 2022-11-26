import { Body, Controller, Get, Post } from '@nestjs/common';
import { Delete, Param } from '@nestjs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { NutritionsDTO } from './nutritions.dto';
import {
  AddNutrition,
  HandleIngridientDeletePayload,
} from './nutritions.interface';

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

  @Delete('nutritions/:id')
  async deleteNutrition(@Param('id') id: number): Promise<string> {
    return await this.service.deleteNutrition(id);
  }

  @EventPattern('ingridient.deleted')
  async handleIngridientDeleted(
    @Payload() message: HandleIngridientDeletePayload,
  ): Promise<void> {
    return await this.service.handleIngridientDeleted(
      Number(message.ingridient_id),
    );
  }
}
