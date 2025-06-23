import { PrismaService } from '@/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NutritionLog, MealTypeEnum } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import axios from 'axios';

@Injectable()
export class NutritionService {
   constructor(
      private readonly prisma: PrismaService
    ) {}

   async create({
    userId,
    foodId,
    quantityConsumed,
    mealType,
    loggedAt,
    notes,
  }: {
    userId: string;
    foodId: string; 
    quantityConsumed: number;
    mealType: MealTypeEnum;
    loggedAt?: Date;
    notes?: string;
  }): Promise<NutritionLog> {
    console.error('Creating nutrition log:', { userId, foodId, quantityConsumed, mealType, loggedAt, notes });
    let dbFood = await this.prisma.food.findUnique({
      where: { foodId: foodId },
    });

    if (!dbFood) {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${foodId}.json`);
      const product = response.data.product;
      if (!product) {
        throw new NotFoundException(`No food found with barcode: ${foodId}`);
      }
      dbFood = await this.prisma.food.create({
        data: {
          foodId: foodId,
          name: product.product_name || 'Unknown',
          calories: product.nutriments?.['energy-kcal_100g'] ?? 0,
          proteinG: product.nutriments?.['proteins_100g'] ?? 0,
          carbsG: product.nutriments?.['carbohydrates_100g'] ?? 0,
          fatG: product.nutriments?.['fat_100g'] ?? 0,
        },
      });
    }

    return this.prisma.nutritionLog.create({
      data: {
        quantityConsumed: new Decimal(quantityConsumed),
        mealType,
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
        user: { connect: { clerkUserId: userId } },
        food: { connect: { foodId: dbFood.foodId } },
        notes,
      },
      include: { food: true },
    });
  }

  async findAll(userId: string, date?: Date) {
    console.error('Creating nutrition log:', { userId, date });
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    return this.prisma.nutritionLog.findMany({
      where: {
        user: { clerkUserId: userId },
        loggedAt: {
          gte: targetDate,
          lte: endDate,
        },
      },
      include: { food: true },
    });
  }

  update(id: number, updateNutritionDto: Prisma.NutritionLogUpdateInput) {
    return `This action updates a #${id} nutrition`;
  }

  remove(id: number) {
    return `This action removes a #${id} nutrition`;
  }
}
