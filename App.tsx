import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import Navigation from './src/navigation'
import { usePaymentStore } from './src/store/usePaymentStore'

const queryClient = new QueryClient()

function AppContent() {
  const loadTransactions = usePaymentStore(s => s.loadTransactions)

  useEffect(() => {
    loadTransactions()
  }, [])

  return <Navigation />
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
