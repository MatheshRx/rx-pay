import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types'
import { COLORS } from '../constants'
import { validateUpiId, resolveRecipientName, getBankFromUpiId } from '../utils/payment'

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>
}

export default function HomeScreen({ navigation }: Props) {
  const [upiId, setUpiId] = useState('')
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [bankName, setBankName] = useState('')

  const handleUpiChange = useCallback((text: string) => {
    setUpiId(text)
    setError('')
    setVerified(false)
    setRecipientName('')
  }, [])

  const handleVerify = useCallback(async () => {
    if (!validateUpiId(upiId)) {
      setError('Enter a valid UPI ID (e.g. name@okaxis)')
      return
    }
    setIsVerifying(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsVerifying(false)
    setVerified(true)
    setRecipientName(resolveRecipientName(upiId))
    setBankName(getBankFromUpiId(upiId))
  }, [upiId])

  const handleProceed = useCallback(() => {
    navigation.navigate('Amount', { upiId, recipientName })
  }, [navigation, upiId, recipientName])

  const handleHistory = useCallback(() => {
    navigation.navigate('History')
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Rx</Text>
            </View>
            <Pressable onPress={handleHistory} style={styles.historyBtn}>
              <Text style={styles.historyBtnText}>History</Text>
            </Pressable>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Send Money</Text>
            <Text style={styles.subtitle}>Enter UPI ID to get started</Text>
          </View>

          {/* Input Card */}
          <View style={styles.card}>
            <Text style={styles.label}>UPI ID</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="name@okaxis"
              placeholderTextColor={COLORS.textMuted}
              value={upiId}
              onChangeText={handleUpiChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Verified state */}
            {verified && (
              <View style={styles.verifiedCard}>
                <View style={styles.verifiedDot} />
                <View>
                  <Text style={styles.verifiedName}>{recipientName}</Text>
                  <Text style={styles.verifiedBank}>{bankName}</Text>
                </View>
              </View>
            )}

            <Pressable
              style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
              onPress={verified ? handleProceed : handleVerify}
              disabled={isVerifying || !upiId}
            >
              {isVerifying ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.verifyBtnText}>
                  {verified ? 'Proceed to Pay' : 'Verify UPI ID'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Quick tips */}
          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>Supported formats</Text>
            <Text style={styles.tipsText}>name@okaxis · name@ybl · name@paytm · name@gpay</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  logoContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  historyBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  historyBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  titleSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16, color: COLORS.text, backgroundColor: COLORS.background },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 6 },
  verifiedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successLight, borderRadius: 10, padding: 12, marginTop: 12, gap: 10 },
  verifiedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  verifiedName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  verifiedBank: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  verifyBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 16 },
  verifyBtnDisabled: { opacity: 0.6 },
  verifyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  tips: { marginTop: 24, padding: 16, backgroundColor: COLORS.primaryLight, borderRadius: 12 },
  tipsTitle: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginBottom: 4 },
  tipsText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
})
