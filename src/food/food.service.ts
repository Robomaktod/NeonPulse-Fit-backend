import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { PrismaService } from '../database/prisma.service';
import { Food, User, NutritionLog, MealTypeEnum } from '@prisma/client';

const OPENFOODFACTS_API_BASE_URL = 'https://world.openfoodfacts.org/api/v2/product/';
//3017620422003
@Injectable()
export class FoodService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  create(createFoodDto: Prisma.FoodCreateInput) {
    return 'This action adds a new food';
  }

  async searchFoodByName(name: string): Promise<any> {
    try {
      

      const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&json=1`);
      const products = response.data.products;

      if (!products || products.length === 0) {
        throw new NotFoundException(`No food found with name: ${name}`);
      }

      return products[0];

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('OpenFoodFacts API error:', error.response.data);
        throw new InternalServerErrorException('Failed to fetch food from OpenFoodFacts API.');
      } else if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's our custom NotFoundException
      }
      console.error('Error in searchFoodByName:', error.message);
      throw new InternalServerErrorException('An unexpected error occurred while searching for food.');
    }
  }

  async searchFoodByBarcode(barcode: string): Promise<any> {
    try {
      const response = await axios.get(`${OPENFOODFACTS_API_BASE_URL}${barcode}.json`);
      const product = response.data.product;

      if (!product) {
        throw new NotFoundException(`No food found with barcode: ${barcode}`);
      }
      return product;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new NotFoundException(`No food found with barcode: ${barcode}`);
        }
        console.error('OpenFoodFacts API error:', error.response.data);
        throw new InternalServerErrorException('Failed to fetch food from OpenFoodFacts API.');
      }
      console.error('Error in searchFoodByBarcode:', error.message);
      throw new InternalServerErrorException('An unexpected error occurred while searching for food.');
    }
  }

  findAll() {
    return `This action returns all food`;
  }

  findOne(id: number) {
    return `This action returns a #${id} food`;
  }

  update(id: number, updateFoodDto: Prisma.FoodUpdateInput) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }

  async logUserConsumption(userId: string, foodId: number, quantityConsumed: number, mealType: MealTypeEnum, loggedAt: Date = new Date()): Promise<NutritionLog> {
    return this.prisma.nutritionLog.create({
      data: {
        userId,
        foodId,
        quantityConsumed,
        mealType,
        loggedAt,
      },
    });
  }

  async getUserDailyCalories(userId: string, date: Date): Promise<number> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const consumptions = await this.prisma.nutritionLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: start,
          lte: end,
        },
      },
      include: { food: true },
    });
    return consumptions.reduce((sum, c) => sum + Number(c.food.calories) * Number(c.quantityConsumed), 0);
  }
}
