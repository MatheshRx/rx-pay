import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList, Transaction } from '../types'
import { COLORS } from '../constants'
import { processPayment, formatCurrency, generateTransactionId } from '../utils/payment'
import { usePaymentStore } from '../store/usePaymentStore'

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Processing'>
  route: RouteProp<RootStackParamList, 'Processing'>
}

export default function ProcessingScreen({ navigation, route }: Props) {
  const { upiId, recipientName, amount, note } = route.params
  const addTransaction = usePaymentStore(s => s.addTransaction)

  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(800 - delay),
        ])
      )

    const a1 = animateDot(dot1, 0)
    const a2 = animateDot(dot2, 200)
    const a3 = animateDot(dot3, 400)

    a1.start()
    a2.start()
    a3.start()

    return () => {
      a1.stop()
      a2.stop()
      a3.stop()
    }
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        await processPayment(amount)

        const transaction: Transaction = {
          id: generateTransactionId(),
          upiId,
          recipientName,
          amount,
          note,
          status: 'success',
          timestamp: Date.now(),
        }
        await addTransaction(transaction)

        navigation.replace('Result', {
          status: 'success',
          amount,
          upiId,
        })
      } catch (reason) {
        const failureReason = typeof reason === 'string' ? reason : 'Payment failed'

        const transaction: Transaction = {
          id: generateTransactionId(),
          upiId,
          recipientName,
          amount,
          note,
          status: 'failed',
          timestamp: Date.now(),
          failureReason,
        }
        await addTransaction(transaction)

        navigation.replace('Result', {
          status: 'failed',
          amount,
          upiId,
          failureReason,
        })
      }
    }

    run()
  }, [])

  const dotStyle = (dot: Animated.Value) => ({
    opacity: dot,
    transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
  })

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⟳</Text>
        </View>

        <Text style={styles.title}>Processing Payment</Text>
        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        <Text style={styles.subtitle}>Sending to {recipientName}</Text>

        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, dotStyle(dot1)]} />
          <Animated.View style={[styles.dot, dotStyle(dot2)]} />
          <Animated.View style={[styles.dot, dotStyle(dot3)]} />
        </View>

        <Text style={styles.note}>Please do not close the app</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  icon: { fontSize: 36, color: COLORS.primary },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  amount: { fontSize: 36, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 32 },
  dotsContainer: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  note: { fontSize: 13, color: COLORS.textMuted },
})
