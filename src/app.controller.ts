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
  HandleIngredientDeletePayload,
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

  @EventPattern('ingredient.deleted')
  async handleIngredientDeleted(
    @Payload() message: HandleIngredientDeletePayload,
  ): Promise<void> {
    return await this.service.handleIngredientDeleted(
      Number(message.ingredient_id),
    );
  }
}
