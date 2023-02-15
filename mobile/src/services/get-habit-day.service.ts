import { api } from "../lib/axios"

export const getHabitDay = async (date: string) => {
    const result = await api.get('day', {
        params: {
            date
        }
    })

    return result.data
}