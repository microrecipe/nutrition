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
import { NutritionsService } from './nutritions.service';
import { UserPayload } from '../auth/auth.decorator';
import { NutritionsDTO } from '../nutritions.dto';
import {
  AddNutrition,
  HandleIngredientDeletePayload,
  UserType,
} from '../nutritions.interface';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class NutritionsController {
  constructor(private readonly service: NutritionsService) {}

  @Get('nutritions')
  async listNutritions(): Promise<NutritionsDTO[]> {
    return await this.service.listNutritions();
  }

  @Get('nutritions/:id')
  async getNutritionById(@Param('id') id: number): Promise<NutritionsDTO> {
    return await this.service.getNutritionById(id);
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
