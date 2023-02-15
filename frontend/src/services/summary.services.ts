import { api } from "../lib/axios"

export const getSummaryService = async () => {
   const response = await api.get('/summary')
   return response
}