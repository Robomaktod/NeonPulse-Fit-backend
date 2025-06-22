import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionController } from './nutrition.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  controllers: [NutritionController],
  providers: [NutritionService, PrismaService],
})
export class NutritionModule {}
