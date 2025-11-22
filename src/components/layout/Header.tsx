import React from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Activity } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between max-w-3xl mx-auto px-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Habitual</span>
                </div>
                <ThemeToggle />
            </div>
        </header>
    )
}
