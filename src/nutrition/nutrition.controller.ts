import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { Prisma } from '@prisma/client';

@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Post("create")
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

  @Get("getAll")
  async findAll(@Query('userId') userId: string, @Query('date') date?: string) {
    // Parse date if provided
    const parsedDate = date ? new Date(date) : undefined;
    return this.nutritionService.findAll(userId, parsedDate);
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
