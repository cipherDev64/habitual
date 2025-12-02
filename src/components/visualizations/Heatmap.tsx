"use client"

import React from 'react'
import { useHabits } from '@/context/HabitContext'
import { getHeatmapData } from '@/lib/stats'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip' // Need to create Tooltip
import { cn } from '@/lib/utils'
import { parseISO, format } from 'date-fns'

// I need to create a Tooltip component first or use a simple title attribute.
// I'll use a simple title for now to avoid extra files, or create a simple Tooltip component in the same file or separate.
// Let's create a simple tooltip using standard HTML title for MVP, or better, a custom hover.
// Actually, I'll create a `Tooltip` component in `src/components/ui/tooltip.tsx` later or now.
// I'll assume I'll create it.

export function Heatmap() {
    const { logs } = useHabits()
    const data = getHeatmapData(logs, 364) // 52 weeks * 7 days = 364

    // Group by weeks
    const weeks: typeof data[] = []
    let currentWeek: typeof data = []

    data.forEach((day, index) => {
        if (index % 7 === 0 && currentWeek.length) {
            weeks.push(currentWeek)
            currentWeek = []
        }
        currentWeek.push(day)
    })
    if (currentWeek.length) weeks.push(currentWeek)

    const getColor = (count: number) => {
        if (count === 0) return "bg-muted"
        if (count === 1) return "bg-primary/30"
        if (count === 2) return "bg-primary/50"
        if (count === 3) return "bg-primary/70"
        return "bg-primary"
    }

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-max">
                <TooltipProvider>
                    <div className="flex gap-1">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {week.map((day) => (
                                    <Tooltip key={day.date}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={cn(
                                                    "h-3 w-3 rounded-sm transition-colors hover:ring-1 hover:ring-ring cursor-default",
                                                    getColor(day.count)
                                                )}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{day.date}: {day.count} completed</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    )
}
