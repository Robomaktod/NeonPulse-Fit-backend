import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService, PrismaService],
  exports: [ActivityService],
})
export class ActivityModule {}
