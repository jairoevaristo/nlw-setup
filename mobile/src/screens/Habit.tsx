import { useCallback, useState } from "react"
import { useFocusEffect, useRoute } from "@react-navigation/native"
import { Alert, ScrollView, Text, View } from "react-native"
import dayjs from 'dayjs'
import clsx from "clsx"

import { BackButton } from "../components/BackButton"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from '../components/Checkbox'
import { Loading } from "../components/Loading"
import { HabitsEmpty } from "../components/HabitsEmpty"

import { getHabitDay } from '../services/get-habit-day.service'

import { generateProgressPorcentage } from "../utilts/generate-progres-percentage"
import { toggleHabit } from "../services/toggle-habit.service"

type RouteParams = {
    date: string;
}

type DayInfoData = {
    completedHabits: string[]
    possibleHabits: {
        id: string
        title: string
    }[]
}

export const Habit = () => {
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoData | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute()
    const { date } = route.params as RouteParams

    const parsedDate = dayjs(date)
    const isDateInParse = parsedDate.endOf('day').isBefore(new Date)
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM')

    const habitsProgress = dayInfo?.possibleHabits.length > 0 ? generateProgressPorcentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    const handleToggleHabit = (habitId: string) => {
        toggleHabit(habitId)

        if (completedHabits.includes(habitId)) {
            setCompletedHabits(prevState => {
                return prevState.filter(item => item !== habitId)
            })
        } else {
            setCompletedHabits(prevState => [...prevState, habitId])
        }
    }

    useFocusEffect(useCallback(() => {
        getHabitDay(date)
            .then(response => {
                setDayInfo(response)
                setCompletedHabits(response?.completedHabits)
            })
            .catch(() => {
                Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
            })
            .finally(() => {
                setLoading(false)
            })
    }, []))

    if (loading) {
        return (
            <Loading />
        )
    }
    
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View className={clsx('mt-6', {
                    'opacity-50': isDateInParse
                })}>
                    {
                        dayInfo?.possibleHabits 
                            ? (
                                dayInfo?.possibleHabits.map(day => {
                                    return (
                                        <Checkbox 
                                            key={day.id} 
                                            title={day.title} 
                                            checked={completedHabits.includes(day.id)}
                                            onPress={() => handleToggleHabit(day.id)}
                                            disabled={isDateInParse}
                                        />
                                    )
                                })
                            )
                        : <HabitsEmpty />
                    }
                </View>

                {
                    isDateInParse && (
                        <Text className="text-white mt-10 text-center">
                            Você não pode um hábitos de uma data passada
                        </Text>
                    )
                }

            </ScrollView>
        </View>
    )
}