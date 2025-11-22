"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Habit, HabitLog } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid'; // We need to install uuid or use a simple generator

// Simple ID generator if uuid is not installed, but better to install uuid.
// For now, I'll use a simple random string generator to avoid extra dependency if not needed, 
// but uuid is standard. I'll use a simple one for now to keep it lightweight as per "minimalist".
const generateId = () => Math.random().toString(36).substr(2, 9);

interface HabitContextType {
    habits: Habit[];
    logs: HabitLog;
    addHabit: (name: string, description?: string) => void;
    editHabit: (id: string, updates: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleHabit: (habitId: string, date: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habitual-habits', []);
    const [logs, setLogs] = useLocalStorage<HabitLog>('habitual-logs', {});

    const addHabit = (name: string, description?: string) => {
        const newHabit: Habit = {
            id: generateId(),
            name,
            description,
            createdAt: new Date().toISOString(),
            archived: false,
        };
        setHabits((prev) => [...prev, newHabit]);
    };

    const editHabit = (id: string, updates: Partial<Habit>) => {
        setHabits((prev) =>
            prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
        );
    };

    const deleteHabit = (id: string) => {
        setHabits((prev) => prev.filter((habit) => habit.id !== id));
        // Optional: cleanup logs for this habit
        setLogs((prev) => {
            const newLogs = { ...prev };
            // This is expensive to iterate all dates. 
            // For now, we keep logs. Or we can cleanup.
            // Let's keep it simple.
            return newLogs;
        });
    };

    const toggleHabit = (habitId: string, date: string) => {
        setLogs((prev) => {
            const dayLogs = prev[date] || {};
            const isCompleted = dayLogs[habitId];

            const newDayLogs = { ...dayLogs };
            if (isCompleted) {
                delete newDayLogs[habitId];
            } else {
                newDayLogs[habitId] = true;
            }

            return {
                ...prev,
                [date]: newDayLogs,
            };
        });
    };

    return (
        <HabitContext.Provider value={{ habits, logs, addHabit, editHabit, deleteHabit, toggleHabit }}>
            {children}
        </HabitContext.Provider>
    );
}

export function useHabits() {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
}
