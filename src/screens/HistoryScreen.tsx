import React, { useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList, Transaction } from '../types'
import { COLORS } from '../constants'
import { formatCurrency, formatDate } from '../utils/payment'
import { usePaymentStore } from '../store/usePaymentStore'

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'History'>
}

export default function HistoryScreen({ navigation }: Props) {
  const transactions = usePaymentStore(s => s.transactions)
  const clearHistory = usePaymentStore(s => s.clearHistory)

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all transactions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory },
      ]
    )
  }, [clearHistory])

  const renderItem = useCallback(({ item }: { item: Transaction }) => {
    const isSuccess = item.status === 'success'
    return (
      <View style={styles.transactionCard}>
        <View style={[styles.statusDot, isSuccess ? styles.dotSuccess : styles.dotError]} />
        <View style={styles.transactionInfo}>
          <Text style={styles.recipientName}>{item.recipientName}</Text>
          <Text style={styles.upiId}>{item.upiId}</Text>
          {item.note ? <Text style={styles.note}>"{item.note}"</Text> : null}
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.amount, isSuccess ? styles.amountSuccess : styles.amountError]}>
            {isSuccess ? '-' : ''}{formatCurrency(item.amount)}
          </Text>
          <Text style={[styles.statusLabel, isSuccess ? styles.statusSuccess : styles.statusError]}>
            {isSuccess ? 'Success' : 'Failed'}
          </Text>
        </View>
      </View>
    )
  }, [])

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No transactions yet</Text>
      <Text style={styles.emptySubtitle}>Your payment history will appear here</Text>
    </View>
  ), [])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>History</Text>
        {transactions.length > 0 ? (
          <Pressable onPress={handleClear}>
            <Text style={styles.clearBtn}>Clear</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {transactions.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {transactions.length} transaction{transactions.length > 1 ? 's' : ''} · {transactions.filter(t => t.status === 'success').length} successful
          </Text>
        </View>
      )}

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={transactions.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backBtn: { paddingVertical: 4 },
  backBtnText: { fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.text },
  clearBtn: { fontSize: 14, color: COLORS.error, fontWeight: '500' },
  placeholder: { width: 40 },
  summary: { paddingHorizontal: 20, paddingBottom: 8 },
  summaryText: { fontSize: 13, color: COLORS.textSecondary },
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  emptyList: { flex: 1 },
  transactionCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.card, borderRadius: 14, padding: 16, gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  dotSuccess: { backgroundColor: COLORS.success },
  dotError: { backgroundColor: COLORS.error },
  transactionInfo: { flex: 1 },
  recipientName: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  upiId: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  note: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 2 },
  timestamp: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  transactionRight: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  amountSuccess: { color: COLORS.text },
  amountError: { color: COLORS.error },
  statusLabel: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusSuccess: { color: COLORS.success, backgroundColor: COLORS.successLight },
  statusError: { color: COLORS.error, backgroundColor: COLORS.errorLight },
  separator: { height: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary },
})
