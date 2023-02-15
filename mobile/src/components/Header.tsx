import { Text, TouchableOpacity, View } from "react-native"
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { useNavigation } from "@react-navigation/native"

import LogoImg from '../assets/logo.svg'

export const Header = () => {
    const { navigate } = useNavigation()

    return (
        <View className="w-full flex-row items-center justify-between">
            <LogoImg />

            <TouchableOpacity
                onPress={() => navigate('new')}
                activeOpacity={0.7}
                className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
            >
                <Feather 
                    name="plus"
                    color={colors.violet[500]}
                    size={20}
                />

                <Text className="text-white font-semibold text-base ml-3">
                    Novo
                </Text>
            </TouchableOpacity>
        </View>
    )
}