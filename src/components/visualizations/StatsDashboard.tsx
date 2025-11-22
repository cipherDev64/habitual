"use client"

import React from 'react'
import { useHabits } from '@/context/HabitContext'
import { calculateStreaks } from '@/lib/stats'
import { Flame, Trophy, Target } from 'lucide-react'

export function StatsDashboard() {
    const { logs, habits } = useHabits()
    const stats = calculateStreaks(logs, habits)

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium uppercase">Current Streak</span>
                </div>
                <div className="text-2xl font-bold">{stats.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
            </div>

            <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-medium uppercase">Best Streak</span>
                </div>
                <div className="text-2xl font-bold">{stats.longestStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
            </div>

            <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium uppercase">Completion</span>
                </div>
                <div className="text-2xl font-bold">{stats.completionRate}% <span className="text-sm font-normal text-muted-foreground">30d</span></div>
            </div>
        </div>
    )
}
