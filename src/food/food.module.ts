import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [FoodController],
  providers: [FoodService, PrismaService],
})
export class FoodModule {}
