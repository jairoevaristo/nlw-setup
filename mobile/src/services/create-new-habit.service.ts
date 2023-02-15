import { api } from "../lib/axios"

type Params = {
    title: string
    weekDays: number[]
}

export const createNewHabit = async ({ title, weekDays }: Params) => {
    const result = await api.post('/habits', {
        title,
        weekDays
    })

    return result.data
}