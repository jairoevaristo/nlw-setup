import { useEffect, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { getHabitsDay } from '../services/day-habits.services';
import dayjs from 'dayjs';
import { toggleHabit } from '../services/toggle-habit.service';

type HabitDayPopoverProps = {
    date: Date
    onCompletedChange: (completed: number) => void
}

type HabitInfoData = {
    possibleHabits: {
        id: string
        title: string
        created_at: string
    }[]
    completedHabits: string[]
}

export const HabitDayPopover = ({ date, onCompletedChange }: HabitDayPopoverProps) => {
    const [habitsInfo, setHabitsInfo] = useState<HabitInfoData>()

    useEffect(() => {
        getHabitsDay(date)
            .then(response => {
                setHabitsInfo(response)
            })
    }, [])

    const handleToggleHabit = (habitId: string) => {
        toggleHabit(habitId)

        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

        let completedHabits: string[] = []

        if (isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits
        })

        onCompletedChange(completedHabits.length)
    }

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    return (
        <div className='mt-6 flex flex-col gap-3'>
            {
                habitsInfo?.possibleHabits.map(possibleHabit => {
                    return (
                        <Checkbox.Root
                            key={possibleHabit.id}
                            disabled={isDateInPast}
                            onCheckedChange={() => handleToggleHabit(possibleHabit.id)}
                            checked={habitsInfo.completedHabits.includes(possibleHabit.id)}
                            className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                        >
                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white" />
                                </Checkbox.Indicator>
                            </div>

                            <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                {possibleHabit.title}
                            </span>
                        </Checkbox.Root>
                    )
                })
            }
            
        </div>
    )
}