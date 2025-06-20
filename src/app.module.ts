// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FoodModule } from './food/food.module';
// import { UsersModule } from './users/users.module';
// import { ActivitiesModule } from './activities/activities.module';
// import { ActivityLogsModule } from './activity-logs/activity-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app
      envFilePath: '.env',
    }),
    DatabaseModule,
    FoodModule
    // UsersModule,
    // ActivitiesModule,
    // ActivityLogsModule,
    // Add other feature modules here (e.g., FoodModule, FoodLogsModule)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}