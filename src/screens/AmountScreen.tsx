import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../types'
import { COLORS } from '../constants'
import { formatCurrency } from '../utils/payment'

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Amount'>
  route: RouteProp<RootStackParamList, 'Amount'>
}

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000]

export default function AmountScreen({ navigation, route }: Props) {
  const { upiId, recipientName } = route.params
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const handleAmountChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '')
    setAmount(cleaned)
    setError('')
  }, [])

  const handleQuickAmount = useCallback((value: number) => {
    setAmount(value.toString())
    setError('')
  }, [])

  const handleProceed = useCallback(() => {
    const parsed = parseInt(amount)
    if (!amount || isNaN(parsed)) {
      setError('Enter a valid amount')
      return
    }
    if (parsed < 1) {
      setError('Minimum amount is ₹1')
      return
    }
    if (parsed > 100000) {
      setError('Maximum amount is ₹1,00,000 per transaction')
      return
    }
    navigation.navigate('Confirm', { upiId, recipientName, amount: parsed, note })
  }, [amount, note, navigation, upiId, recipientName])

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const parsedAmount = parseInt(amount)
  const isValidAmount = amount && !isNaN(parsedAmount) && parsedAmount >= 1

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </Pressable>
          </View>

          <View style={styles.recipientCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {recipientName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.recipientName}>{recipientName}</Text>
              <Text style={styles.recipientUpi}>{upiId}</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              maxLength={7}
              autoFocus
            />
          </View>

          {isValidAmount && (
            <Text style={styles.amountWords}>
              {formatCurrency(parsedAmount)}
            </Text>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map(value => (
              <Pressable
                key={value}
                style={[
                  styles.quickChip,
                  parseInt(amount) === value && styles.quickChipActive,
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text
                  style={[
                    styles.quickChipText,
                    parseInt(amount) === value && styles.quickChipTextActive,
                  ]}
                >
                  ₹{value >= 1000 ? `${value / 1000}K` : value}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Add a note (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. Rent, Dinner, etc."
              placeholderTextColor={COLORS.textMuted}
              value={note}
              onChangeText={setNote}
              maxLength={50}
            />
          </View>

          <Pressable
            style={[styles.proceedBtn, !isValidAmount && styles.proceedBtnDisabled]}
            onPress={handleProceed}
            disabled={!isValidAmount}
          >
            <Text style={styles.proceedBtnText}>
              {isValidAmount ? `Pay ${formatCurrency(parsedAmount)}` : 'Enter Amount'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: { marginBottom: 24 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  backBtnText: { fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  recipientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 32, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  recipientName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  recipientUpi: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  currencySymbol: { fontSize: 36, fontWeight: '600', color: COLORS.text, marginRight: 4 },
  amountInput: { fontSize: 56, fontWeight: '700', color: COLORS.text, minWidth: 80, textAlign: 'center' },
  amountWords: { textAlign: 'center', fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  errorText: { textAlign: 'center', fontSize: 13, color: COLORS.error, marginBottom: 8 },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginVertical: 20 },
  quickChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.card },
  quickChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  quickChipText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  quickChipTextActive: { color: COLORS.primary, fontWeight: '600' },
  noteContainer: { marginBottom: 32 },
  noteLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  noteInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.card },
  proceedBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  proceedBtnDisabled: { opacity: 0.4 },
  proceedBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
})
