import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class OpenFoodFactsService {
  private readonly baseUrl = 'https://world.openfoodfacts.org';

  constructor(private readonly httpService: HttpService) {}

  async getFoodByBarcode(barcode: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/api/v0/product/${barcode}.json`;
      const response: AxiosResponse = await this.httpService.axiosRef.get(url);
      if (response.data.status === 1) {
        return response.data.product;
      } else {
        throw new HttpException('Product not found', 404);
      }
    } catch (error) {
      throw new HttpException('Error fetching product', 500);
    }
  }

  async searchFoodByName(name: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1`;
      const response: AxiosResponse = await this.httpService.axiosRef.get(url);
      return response.data.products || [];
    } catch (error) {
      throw new HttpException('Error searching for food', 500);
    }
  }
}
