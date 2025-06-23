import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  create(createActivityDto: CreateActivityDto) {
    return 'This action adds a new activity';
  }

  findAll() {
   return this.prisma.activityCategory.findMany();
  }


  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }

  async logActivity(data: any) {
    if (data.type === 'exercise') {
      return this.prisma.userExerciseLog.create({
        data: {
          userId: data.userId,
          exerciseTypeId: 1, // You may want to look up or create exercise types
          sets: Number(data.sets),
          repsPerSet: Number(data.reps),
          loggedAt: new Date(data.date),
        },
      });
    } else {
      return this.prisma.userActivityLog.create({
        data: {
          userId: data.userId,
          activityCategoryId: 1, // You may want to look up or create activity categories
          durationMinutes: Number(data.duration),
          startedAt: new Date(data.date),
        },
      });
    }
  }

  async getActivityCategories() {
    return this.prisma.activityCategory.findMany();
  }

  async getExerciseTypes() {
    return this.prisma.exerciseType.findMany();
  }
}
