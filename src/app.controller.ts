import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UserPayload } from './auth.decorator';
import { JwtAuthGuard } from './auth.guard';
import { NutritionsDTO } from './nutritions.dto';
import {
  AddNutrition,
  HandleIngridientDeletePayload,
  UserType,
} from './nutritions.interface';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('nutritions')
  async listNutritions(): Promise<NutritionsDTO[]> {
    return await this.service.listNutritions();
  }

  @Post('nutritions')
  @UseGuards(JwtAuthGuard)
  async addNutrition(
    @Body() body: AddNutrition,
    @UserPayload() user: UserType,
  ): Promise<NutritionsDTO> {
    return await this.service.addNutrition(body, user);
  }

  @Delete('nutritions/:id')
  @UseGuards(JwtAuthGuard)
  async deleteNutrition(
    @Param('id') id: number,
    @UserPayload() user: UserType,
  ): Promise<string> {
    return await this.service.deleteNutrition(id, user);
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
