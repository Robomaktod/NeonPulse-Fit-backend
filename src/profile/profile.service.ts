import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ProfileService {
   constructor(
        private readonly prisma: PrismaService
      ) {}

  async create(createProfileDto: Prisma.UserCreateInput) {
    // Implement creation logic as needed
    return this.prisma.user.create({ data: createProfileDto });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    // id is clerkUserId
    // Also load latest weight from UserWeightLog
    const user = await this.prisma.user.findUnique({ where: { clerkUserId: id } });
    const latestWeightLog = await this.prisma.userWeightLog.findFirst({
      where: { userId: id },
      orderBy: { loggedAt: 'desc' },
    });
    return {
      ...user,
      currentWeight: latestWeightLog ? Number(latestWeightLog.weightKg) : null,
      currentWeightDate: latestWeightLog ? latestWeightLog.loggedAt : null,
    };
  }

  async update(id: string, updateProfileDto: any) {
    const { name, heightCm, dateOfBirth } = updateProfileDto;
    // Only update fields that exist in the User model
    return this.prisma.user.update({
      where: { clerkUserId: id },
      data: {
        ...(name && { displayUsername: name }),
        ...(heightCm && { heightCm: Number(heightCm) }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        // fitnessGoals removed: not in schema
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { clerkUserId: id } });
  }
}
