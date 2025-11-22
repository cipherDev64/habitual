"use client"

import React, { useState } from 'react'
import { useHabits } from '@/context/HabitContext'
import { Button } from '@/components/ui/button'
import { Check, Trash2, Edit2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { HabitForm } from './HabitForm'

export function HabitList() {
    const { habits, logs, toggleHabit, deleteHabit } = useHabits()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const today = format(new Date(), 'yyyy-MM-dd')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">My Habits</h2>
                <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Habit
                </Button>
            </div>

            {isFormOpen && <HabitForm onClose={() => setIsFormOpen(false)} />}

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {habits.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-12 text-muted-foreground border rounded-lg border-dashed"
                        >
                            <p>No habits yet. Start by adding one!</p>
                        </motion.div>
                    ) : (
                        habits.map((habit) => {
                            const isCompleted = logs[today]?.[habit.id]

                            return (
                                <motion.div
                                    key={habit.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        "group flex items-center justify-between p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
                                        isCompleted && "bg-primary/5 border-primary/20"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleHabit(habit.id, today)}
                                            className={cn(
                                                "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                                                isCompleted
                                                    ? "bg-primary border-primary text-primary-foreground scale-110"
                                                    : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
                                            )}
                                        >
                                            <Check className={cn("h-6 w-6 transition-transform", isCompleted ? "scale-100" : "scale-0")} />
                                        </button>
                                        <div>
                                            <h3 className={cn("font-semibold text-lg leading-none transition-colors", isCompleted && "text-muted-foreground line-through")}>
                                                {habit.name}
                                            </h3>
                                            {habit.description && (
                                                <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Edit button could go here */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this habit?')) {
                                                    deleteHabit(habit.id)
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
