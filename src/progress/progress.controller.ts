import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Add a new weight log
  @Post('weight')
  async addWeightLog(
    @Body() body: { userId: string; weight: number; date?: string }
  ) {
    return this.progressService.addWeightLog(body.userId, body.weight, body.date);
  }

  // Get weight progress for a user
  @Get('weight')
  async getWeightProgress(@Query('userId') userId: string) {
    return this.progressService.getWeightProgress(userId);
  }

  @Get('activity')
  async getActivityTrends(@Query('userId') userId: string) {
    return this.progressService.getActivityTrends(userId);
  }

  @Get('calories')
  async getCalorieTrends(@Query('userId') userId: string) {
    return this.progressService.getCalorieTrends(userId);
  }
}
