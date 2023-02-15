import { useCallback, useState } from "react"
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Feather } from '@expo/vector-icons'

import { BackButton } from "../components/BackButton"
import { Checkbox } from "../components/Checkbox"
import colors from "tailwindcss/colors"
import { createNewHabit } from "../services/create-new-habit.service"

const avaibleWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
]

export const New = () => {
    const [weekDays, setWeekDays] = useState<number[]>([])
    const [title, setTitle] = useState('');

    const handleToggleWeekDay = useCallback((weekDayIndex) => {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(
                prevState => prevState.filter(weekDay => weekDay !== weekDayIndex)
            )
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex])
        }
    }, [weekDays])

    const handleCreateNewHabit = () => {
        if (!title.trim() || weekDays.length === 0) {
            return Alert.alert('Novo Hábito', 'Informe o nome do hábito e escolha o periocidade')
        }

        createNewHabit({ title, weekDays })
            .then(() => {
                Alert.alert('Novo hábito', 'Hábito criado com sucesso!')

                setTitle('')
                setWeekDays([])
            })
            .catch(err => {
                Alert.alert('Ops', 'Não foi possível criar o novo hábito')
            })
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual o seu comprometimento?
                </Text>

                <TextInput
                    placeholder="ex.: Exercícios, dormir bem, etc.."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência
                </Text>

                {
                    avaibleWeekDays.map((item, i) => {
                        return (
                            <Checkbox 
                                key={i}
                                title={item}
                                checked={weekDays.includes(i)}
                                onPress={() => handleToggleWeekDay(i)}
                            />
                        )
                    })
                }

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                    className="w-full h-14 flex flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                >
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}