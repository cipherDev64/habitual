"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useHabits } from '@/context/HabitContext'
import { X } from 'lucide-react'

interface HabitFormProps {
    onClose: () => void
}

export function HabitForm({ onClose }: HabitFormProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const { addHabit } = useHabits()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        addHabit(name, description)
        setName('')
        setDescription('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg ring-1 ring-border animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">New Habit</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Name
                        </label>
                        <Input
                            id="name"
                            placeholder="e.g. Read 30 mins"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Description (optional)
                        </label>
                        <Input
                            id="description"
                            placeholder="e.g. Fiction or Non-fiction"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Habit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
