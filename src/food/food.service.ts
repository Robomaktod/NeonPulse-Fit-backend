import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from '../database/prisma.service';

const OPENFOODFACTS_API_BASE_URL = 'https://world.openfoodfacts.org/api/v2/product/';

@Injectable()
export class FoodService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async searchFoodByName(name: string): Promise<any> {
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&json=1`);
      const products = response.data.products;

      if (!products || products.length === 0) {
        throw new NotFoundException(`No food found with name: ${name}`);
      }

      const product = products[0];
      return {
        id: product._id,
        product_name: product.product_name,
        energy_kcal_100g: product.nutriments?.['energy-kcal_100g'],
        fat_100g: product.nutriments?.['fat_100g'],
        proteins_100g: product.nutriments?.['proteins_100g'],
        sugars_100g: product.nutriments?.['sugars_100g'],
        carbohydrates_100g: product.nutriments?.['carbohydrates_100g'],
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('OpenFoodFacts API error:', error.response.data);
        throw new InternalServerErrorException('Failed to fetch food from OpenFoodFacts API.');
      } else if (error instanceof NotFoundException) {
        throw error; 
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
    return this.prisma.food.findMany();
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
