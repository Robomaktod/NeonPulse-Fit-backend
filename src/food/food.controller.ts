import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodService } from './food.service';
import { Prisma } from '@prisma/client';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('barcode/:barcode')
  getFoodByBarcode(@Param('barcode') barcode: string) {
    return this.foodService.searchFoodByBarcode(barcode);
  }

  @Get('name/:name')
  getFoodByName(@Param('name') name: string) {
    return this.foodService.searchFoodByName(name);
  }

  @Get()
  findAll() {
    return this.foodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: Prisma.FoodUpdateInput) {
    return this.foodService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(+id);
  }
  
}
