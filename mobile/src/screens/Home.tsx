import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Text, View, ScrollView, Alert } from "react-native"
import dayjs from "dayjs"

import { HabitDay, DAY_SIZE } from "../components/HabitDay"
import { Header } from "../components/Header"
import { Loading } from "../components/Loading"
import { getSummaryHabit } from "../services/summary.service"

import { generateRangeDatesFromYearStart } from '../utilts/generate-range-between-dates'

const weekDays = [
    'D',
    'S',
    'T',
    'Q',
    'Q',
    'S',
    'S'
]

type SummaryData = {
    id: string;
    date: string;
    completed: number;
    amount: number
}

const dates = generateRangeDatesFromYearStart()
const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSizes - dates.length

export const Home = () => {
    const { navigate } = useNavigation()

    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryData[] | null>(null)

    useEffect(() => {
        getSummaryHabit()
            .then(response => {
                setSummary(response)
            }).catch(err => {
                Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.')
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <View className="flex-1 bg-background px-8 py-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {weekDays.map((weekDay, i) => (
                    <Text 
                        key={`${weekDay}-${i}`}
                        className="text-zinc-400 text-xl font-bold text-center mx-1"
                        style={{ width: DAY_SIZE }}
                    >
                        {weekDay}
                    </Text>
                )) }
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="flex-row flex-wrap">
                    {
                        dates.map((weekDate, i) => {
                            const dayInWeek = summary.find(day => dayjs(weekDate).isSame(day.date, 'day'))

                            return (
                                <HabitDay 
                                    key={i}
                                    date={weekDate}
                                    amount={dayInWeek?.amount}
                                    completed={dayInWeek?.completed}
                                    onPress={() => navigate('habit', {
                                        date: weekDate.toISOString()
                                    })}
                                />
                            )
                        })
                    } 

                {
                    amountOfDaysToFill > 0 && Array
                        .from({ length: amountOfDaysToFill })
                        .map((_, i) => {
                            return <View
                                key={i}
                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                style={{ width: DAY_SIZE, height: DAY_SIZE }}
                            />
                        })
                }
                </View>
            </ScrollView>
        </View>   
    )
}