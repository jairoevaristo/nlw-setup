import { TouchableOpacity, Dimensions, TouchableOpacityProps } from "react-native"
import clsx from "clsx";
import dayjs from "dayjs";

import { generateProgressPorcentage } from "../utilts/generate-progres-percentage";

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

type HabitDayProps = TouchableOpacityProps & {
    date: Date
    amount?: number
    completed?: number
}

export const HabitDay = ({ amount = 0, completed = 0, date, ...rest }: HabitDayProps) => {
    const amountAccomplishedPorcentage = amount > 0 
        ? generateProgressPorcentage(amount, completed) 
        : 0
    const today = dayjs().startOf('day').toDate()
    const isCurrentToday = dayjs(date).isSame(today) 

    return (
        <TouchableOpacity 
            className={clsx('rounded-lg border-2 m-1', {
                'bg-zinc-900 border-zinc-800': amountAccomplishedPorcentage === 0,
                'bg-violet-900 border-violet-700': amountAccomplishedPorcentage > 0 && amountAccomplishedPorcentage <= 20,
                'bg-violet-800 border-violet-600': amountAccomplishedPorcentage > 20 && amountAccomplishedPorcentage <= 40,
                'bg-violet-700 border-violet-500': amountAccomplishedPorcentage > 40 && amountAccomplishedPorcentage <= 60,
                'bg-violet-600 border-violet-500': amountAccomplishedPorcentage > 60 && amountAccomplishedPorcentage <= 80,
                'bg-violet-500 border-violet-400': amountAccomplishedPorcentage > 80,
                'border-white border-4': isCurrentToday
            })}
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
            {...rest}
        />
            
    )
}