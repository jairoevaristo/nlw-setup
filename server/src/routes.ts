import { FastifyInstance } from "fastify"
import { z } from 'zod'
import dayjs from 'dayjs'

import { prismaClient } from "./infra/database"

export async function appRoutes(app: FastifyInstance) {
    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number()
                .min(0)
                .max(6)
            )
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prismaClient.habit.create({
            data: {
                title,
                created_at: today,
                habitWeekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })
    })

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = dayjs(parsedDate).get('day')

        const possibleHabits = await prismaClient.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                habitWeekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prismaClient.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prismaClient.day.findUnique({
            where: {
                date: today
            }
        })

        if (!day) {
            day = await prismaClient.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prismaClient.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            await prismaClient.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prismaClient.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }

    })

    app.get('/summary', async () => {
        const summary = await prismaClient.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_day HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE   
                        HWD.week_day = cast(strftime('%w', D.date / 1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D
        `

        return summary
    })
}