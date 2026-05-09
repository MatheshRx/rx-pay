import React, { useCallback, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../types'
import { COLORS } from '../constants'
import { formatCurrency } from '../utils/payment'

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Result'>
  route: RouteProp<RootStackParamList, 'Result'>
}

export default function ResultScreen({ navigation, route }: Props) {
  const { status, amount, upiId, failureReason } = route.params
  const isSuccess = status === 'success'

  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleNewPayment = useCallback(() => {
    navigation.popToTop()
  }, [navigation])

  const handleViewHistory = useCallback(() => {
    navigation.replace('History')
  }, [navigation])

  return (
    <SafeAreaView style={[styles.safe, isSuccess ? styles.safeSucess : styles.safeError]}>
      <View style={styles.container}>
        {/* Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            isSuccess ? styles.iconSuccess : styles.iconError,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.iconText}>{isSuccess ? '✓' : '✕'}</Text>
        </Animated.View>

        {/* Status */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={[styles.statusText, isSuccess ? styles.successText : styles.errorText]}>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </Text>

          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
          <Text style={styles.upiId}>{upiId}</Text>

          {!isSuccess && failureReason && (
            <View style={styles.failureReasonCard}>
              <Text style={styles.failureReasonText}>{failureReason}</Text>
            </View>
          )}

          {isSuccess && (
            <View style={styles.successCard}>
              <Text style={styles.successCardText}>
                Money will be credited within a few seconds
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          <Pressable style={styles.primaryBtn} onPress={handleNewPayment}>
            <Text style={styles.primaryBtnText}>
              {isSuccess ? 'New Payment' : 'Try Again'}
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={handleViewHistory}>
            <Text style={styles.secondaryBtnText}>View History</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  safeSucess: { backgroundColor: COLORS.successLight },
  safeError: { backgroundColor: COLORS.errorLight },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconContainer: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  iconSuccess: { backgroundColor: COLORS.success },
  iconError: { backgroundColor: COLORS.error },
  iconText: { fontSize: 44, color: COLORS.white, fontWeight: '700' },
  statusText: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  successText: { color: COLORS.success },
  errorText: { color: COLORS.error },
  amount: { fontSize: 38, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  upiId: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
  successCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8 },
  successCardText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },
  failureReasonCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8 },
  failureReasonText: { fontSize: 13, color: COLORS.error, textAlign: 'center' },
  actions: { position: 'absolute', bottom: 40, left: 32, right: 32 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  secondaryBtn: { backgroundColor: COLORS.white, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  secondaryBtnText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
})
