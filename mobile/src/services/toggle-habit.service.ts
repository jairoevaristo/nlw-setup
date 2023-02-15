import { api } from "../lib/axios"

export const toggleHabit = async (id: string) => {
    await api.patch(`/habits/${id}/toggle`)
}