import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  findAll() {
    return this.activityService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }

  @Post('log')
  async logActivity(@Body() body: any) {
    // body: { userId, name, duration, date, type, sets, reps }
    return this.activityService.logActivity(body);
  }

  @Get('categories')
  async getActivityCategories() {
    return this.activityService.getActivityCategories();
  }

  @Get('exercise-types')
  async getExerciseTypes() {
    return this.activityService.getExerciseTypes();
  }
}
