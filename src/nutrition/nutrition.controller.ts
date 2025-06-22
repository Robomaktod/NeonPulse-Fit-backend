import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { Prisma } from '@prisma/client';

@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Post()
  async create(@Body() body: { userId: string; foodId: string; quantityConsumed: number; mealType: string; loggedAt?: Date; notes?: string }) {
    const { userId, foodId, quantityConsumed, mealType, loggedAt, notes } = body;
    return this.nutritionService.create({
      userId,
      foodId,
      quantityConsumed,
      mealType: mealType as any,
      loggedAt,
      notes,
    });
  }

  @Get()
  findAll() {
    return this.nutritionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNutritionDto: Prisma.NutritionLogUpdateInput) {
    return this.nutritionService.update(+id, updateNutritionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nutritionService.remove(+id);
  }
}
