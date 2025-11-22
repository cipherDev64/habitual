import { HabitLog, Habit } from '@/types';
import { eachDayOfInterval, subDays, format, isSameDay, differenceInDays, parseISO } from 'date-fns';

export function getHeatmapData(logs: HabitLog, days = 365) {
    const today = new Date();
    const startDate = subDays(today, days);

    const dates = eachDayOfInterval({
        start: startDate,
        end: today
    });

    return dates.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLogs = logs[dateStr] || {};
        const count = Object.values(dayLogs).filter(Boolean).length;
        return {
            date: dateStr,
            count,
            dayOfWeek: date.getDay() // 0 = Sunday
        };
    });
}

export function calculateStreaks(logs: HabitLog, habits: Habit[]) {
    // Simple total streak (days with at least one habit completed)
    // Or per-habit streak. 
    // User asked for "Show streak statistics (current streak, longest streak, completion percentage)"
    // Usually this is global or per habit. Let's do global "Active Days" streak for the dashboard.

    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCompleted = 0;
    let totalPossible = 0; // This is hard to calc accurately without history of when habits were created.
    // We'll estimate completion rate based on last 30 days.

    // Calculate Current Streak
    let checkDate = today;
    while (true) {
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        const dayLogs = logs[dateStr];
        const hasActivity = dayLogs && Object.values(dayLogs).some(Boolean);

        if (hasActivity) {
            currentStreak++;
            checkDate = subDays(checkDate, 1);
        } else {
            // If it's today and no activity yet, don't break streak if yesterday had activity?
            // Standard logic: if today has no activity, streak is from yesterday.
            if (isSameDay(checkDate, today)) {
                checkDate = subDays(checkDate, 1);
                continue;
            }
            break;
        }
    }

    // Calculate Longest Streak (simplified: scan last 365 days)
    let tempStreak = 0;
    const pastYear = eachDayOfInterval({ start: subDays(today, 365), end: today });

    pastYear.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLogs = logs[dateStr];
        const hasActivity = dayLogs && Object.values(dayLogs).some(Boolean);

        if (hasActivity) {
            tempStreak++;
        } else {
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 0;
        }
    });
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // Completion Rate (Last 30 days)
    const last30Days = eachDayOfInterval({ start: subDays(today, 29), end: today });
    let completedCount = 0;
    let activeHabitsCount = habits.filter(h => !h.archived).length;

    // This is a rough estimate. 
    // Ideally we check if habit existed on that date.
    // For MVP, we just count total completions vs (active habits * 30).

    last30Days.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLogs = logs[dateStr] || {};
        completedCount += Object.values(dayLogs).filter(Boolean).length;
    });

    const possibleCount = activeHabitsCount * 30;
    const completionRate = possibleCount > 0 ? Math.round((completedCount / possibleCount) * 100) : 0;

    return {
        currentStreak,
        longestStreak,
        completionRate
    };
}
