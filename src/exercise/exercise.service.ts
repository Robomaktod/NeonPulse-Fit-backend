import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(
      private readonly prisma: PrismaService
    ) {}

  async create(createExerciseDto: Prisma.UserExerciseLogCreateInput) {
    return this.prisma.userExerciseLog.create({ data: createExerciseDto });
  }

  findAll() {
    return `This action returns all exercise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exercise`;
  }

  update(id: number, updateExerciseDto: Prisma.UserExerciseLogCreateInput) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }
}
