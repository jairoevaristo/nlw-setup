import React from "react"
import { View, ActivityIndicator } from 'react-native';

export const Loading = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090a' }}>
            <ActivityIndicator size="large" color="#7c3aed" />
        </View>
    )
}