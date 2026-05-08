import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Transaction } from '../types'
import { STORAGE_KEYS } from '../constants'

interface PaymentStore {
  transactions: Transaction[]
  loadTransactions: () => Promise<void>
  addTransaction: (transaction: Transaction) => Promise<void>
  clearHistory: () => Promise<void>
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  transactions: [],

  loadTransactions: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
      if (stored) {
        set({ transactions: JSON.parse(stored) })
      }
    } catch {
      // storage read failed silently — non-critical
    }
  },

  addTransaction: async (transaction: Transaction) => {
    const updated = [transaction, ...get().transactions]
    set({ transactions: updated })
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated))
    } catch {
      // storage write failed silently — non-critical
    }
  },

  clearHistory: async () => {
    set({ transactions: [] })
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTIONS)
    } catch {
      // storage clear failed silently — non-critical
    }
  },
}))
