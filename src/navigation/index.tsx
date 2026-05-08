import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from '../types'
import HomeScreen from '../screens/HomeScreen'
import AmountScreen from '../screens/AmountScreen'
import ConfirmScreen from '../screens/ConfirmScreen'
import ProcessingScreen from '../screens/ProcessingScreen'
import ResultScreen from '../screens/ResultScreen'
import HistoryScreen from '../screens/HistoryScreen'

const Stack = createStackNavigator<RootStackParamList>()

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Amount" component={AmountScreen} />
        <Stack.Screen name="Confirm" component={ConfirmScreen} />
        <Stack.Screen name="Processing" component={ProcessingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
