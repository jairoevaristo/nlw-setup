import { api } from "../lib/axios"

export const getHabitsDay = async (date: Date) => {
    const result = await api.get('/day', {
        params: {
            date: date.toISOString()
        }
    })
    return result.data
}