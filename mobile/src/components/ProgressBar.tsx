import { useEffect } from "react"
import { View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"

type ProgressBarProps = {
    progress?: number
}

export const ProgressBar = ({ progress = 0 }: ProgressBarProps) => {
    const sharedProgress = useSharedValue(progress)

    const styles = useAnimatedStyle(() => {
        return {
            width: `${sharedProgress.value}%`
        }
    })

    useEffect(() => {
        sharedProgress.value = withSpring(progress, {
            overshootClamping: true
        })
    }, [progress])

    return (
        <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
            <Animated.View 
                className="h-3 rounded-lg bg-violet-600"
                style={styles}
            />
        </View>
    )
}