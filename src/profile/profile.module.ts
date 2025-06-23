import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '@/database/prisma.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService],
})
export class ProfileModule {}
