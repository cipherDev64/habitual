export interface Habit {
    id: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: string; // ISO Date string
    archived: boolean;
}

export interface HabitLog {
    [date: string]: { // YYYY-MM-DD
        [habitId: string]: boolean;
    };
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
}
