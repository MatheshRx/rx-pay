import React, { useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../types'
import { COLORS } from '../constants'
import { formatCurrency, getBankFromUpiId } from '../utils/payment'

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Confirm'>
  route: RouteProp<RootStackParamList, 'Confirm'>
}

export default function ConfirmScreen({ navigation, route }: Props) {
  const { upiId, recipientName, amount, note } = route.params

  const handleConfirm = useCallback(() => {
    navigation.navigate('Processing', { upiId, recipientName, amount, note })
  }, [navigation, upiId, recipientName, amount, note])

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Confirm Payment</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Amount display */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>You are paying</Text>
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Row label="To" value={recipientName} />
          <Divider />
          <Row label="UPI ID" value={upiId} />
          <Divider />
          <Row label="Bank" value={getBankFromUpiId(upiId)} />
          <Divider />
          <Row label="Amount" value={formatCurrency(amount)} highlight />
          {note ? (
            <>
              <Divider />
              <Row label="Note" value={note} />
            </>
          ) : null}
        </View>

        {/* UPI PIN note */}
        <View style={styles.pinNote}>
          <Text style={styles.pinNoteText}>
            🔒 You will be asked to enter your UPI PIN to authorize this payment
          </Text>
        </View>

        {/* Confirm button */}
        <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Confirm & Pay</Text>
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={handleBack}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>
        {value}
      </Text>
    </View>
  )
}

function Divider() {
  return <View style={styles.divider} />
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backBtn: { paddingVertical: 4 },
  backBtnText: { fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.text },
  placeholder: { width: 50 },
  amountSection: { alignItems: 'center', marginBottom: 28 },
  amountLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 6 },
  amount: { fontSize: 42, fontWeight: '700', color: COLORS.text },
  card: { backgroundColor: COLORS.card, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowLabel: { fontSize: 14, color: COLORS.textSecondary },
  rowValue: { fontSize: 14, fontWeight: '500', color: COLORS.text, maxWidth: '60%', textAlign: 'right' },
  rowValueHighlight: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
  divider: { height: 0.5, backgroundColor: COLORS.border },
  pinNote: { backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 14, marginBottom: 28 },
  pinNoteText: { fontSize: 13, color: COLORS.primary, lineHeight: 18 },
  confirmBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  confirmBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { fontSize: 15, color: COLORS.textSecondary },
})
