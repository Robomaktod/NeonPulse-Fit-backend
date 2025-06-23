import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Add a new weight log for a user
  async addWeightLog(userId: string, weight: number, date?: string) {
    const loggedAt = date ? new Date(date) : new Date();
    return this.prisma.userWeightLog.create({
      data: {
        userId,
        weightKg: weight,
        loggedAt,
      },
    });
  }

  // Get weight progress for a user
  async getWeightProgress(userId: string) {
    // Get all weight logs for the user, sorted by date ascending
    const logs = await this.prisma.userWeightLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' },
    });
    if (!logs.length) {
      return {
        currentWeight: 0,
        weightUnit: 'kg',
        change: 0,
        goalWeight: 0,
        history: [],
      };
    }
    const user = await this.prisma.user.findUnique({ where: { clerkUserId: userId } });
    const currentWeight = Number(logs[logs.length - 1].weightKg);
    const startWeight = Number(logs[0].weightKg);
    const change = currentWeight - startWeight;
    // Optionally, get goalWeight from user profile if you store it
    // If you don't have goalWeight, just set to 0 or fetch from another source
    // const goalWeight = user?.goalWeight ? Number(user.goalWeight) : 0;
    const goalWeight = 0;
    return {
      currentWeight,
      weightUnit: 'kg',
      change,
      goalWeight,
      history: logs.map((log) => ({
        date: log.loggedAt.toISOString().slice(0, 10),
        weight: Number(log.weightKg),
      })),
    };
  }

  // Activity trends for the week
  async getActivityTrends(userId: string) {
    // Get all activity logs for the current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const logs = await this.prisma.userActivityLog.findMany({
      where: {
        userId,
        startedAt: { gte: startOfWeek },
      },
      orderBy: { startedAt: 'asc' },
    });

    // Build daily breakdown (Mon-Sun)
    const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
    const todayIdx = new Date().getDay();
    const dailyBreakdown = days.map((dayInitial, idx) => {
      const dayLogs = logs.filter(
        (log) => new Date(log.startedAt).getDay() === idx
      );
      const totalMinutes = dayLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);
      return {
        dayInitial,
        activePercent: Math.min(100, (totalMinutes / 60) * 100), // 60 min = 100%
        isFuture: idx > todayIdx,
      };
    });

    const daysCompleted = dailyBreakdown.filter((d) => d.activePercent > 0).length;

    return {
      weeklyActiveDaysLabel: `${daysCompleted}/7 days active`,
      daysCompleted,
      totalDaysInWeek: 7,
      dailyBreakdown,
    };
  }

  // Calorie trends for the week
  async getCalorieTrends(userId: string) {
    // Get user profile for BMR calculation
    const user = await this.prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return [];
    }
    // Calculate BMR (Mifflin-St Jeor Equation)
    // BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + s
    // s = +5 for males, -161 for females
    const now = new Date();
    const birth = user.dateOfBirth;
    const age = now.getFullYear() - birth.getFullYear() - (now < new Date(birth.setFullYear(now.getFullYear())) ? 1 : 0);
    // Get latest weight
    const lastWeightLog = await this.prisma.userWeightLog.findFirst({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
    });
    const weight = lastWeightLog ? Number(lastWeightLog.weightKg) : 70; // fallback
    const height = user.heightCm;
    const gender = user.gender;
    const s = gender === 'Male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    // Assume sedentary (x1.2), can be improved
    const dailyNorma = Math.round(bmr * 1.2);

    // Get all nutrition logs for the current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const logs = await this.prisma.nutritionLog.findMany({
      where: {
        userId,
        loggedAt: { gte: startOfWeek },
      },
      include: { food: true },
      orderBy: { loggedAt: 'asc' },
    });

    // Calculate daily calories for each day of week (Su-Sa)
    const dailyCalories: { [date: string]: number } = {};
    logs.forEach((log) => {
      const date = log.loggedAt.toISOString().slice(0, 10);
      const cals = Number(log.food?.calories || 0) * Number(log.quantityConsumed || 1);
      dailyCalories[date] = (dailyCalories[date] || 0) + cals;
    });
    // Fill missing days with 0
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      weekDates.push(d.toISOString().slice(0, 10));
    }
    const dailyTotals = weekDates.map((date) => dailyCalories[date] || 0);
    const total = dailyTotals.reduce((a, b) => a + b, 0);
    const avg = Math.round(total / 7);
    const weeklyTarget = dailyNorma * 7;

    return [
      {
        id: 'avg',
        label: 'Daily Average',
        value: `${avg} cal`,
        progressPercent: Math.min(100, (avg / dailyNorma) * 100),
      },
      {
        id: 'weekly',
        label: 'Weekly Total',
        value: `${total} cal`,
        progressPercent: Math.min(100, (total / weeklyTarget) * 100),
      },
      {
        id: 'norma',
        label: 'Your Daily Norma',
        value: `${dailyNorma} cal`,
        progressPercent: 100,
      },
    ];
  }

  create(createProgressDto: CreateProgressDto) {
    return 'This action adds a new progress';
  }

  findAll() {
    return `This action returns all progress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} progress`;
  }

  update(id: number, updateProgressDto: UpdateProgressDto) {
    return `This action updates a #${id} progress`;
  }

  remove(id: number) {
    return `This action removes a #${id} progress`;
  }
}
