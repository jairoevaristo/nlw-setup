import { api } from "../lib/axios";

type CreateHabitParams = {
    title: string;
    weekDays: number[]
}

export const createHabit = async ({ title, weekDays }: CreateHabitParams) => {
    const result = await api.post('/habits', {
        title,
        weekDays
    })
}