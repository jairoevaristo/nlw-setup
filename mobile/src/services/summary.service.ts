import { api } from "../lib/axios"

export const getSummaryHabit = async () => {
    const result = await api.get('/summary')
    return result.data
}